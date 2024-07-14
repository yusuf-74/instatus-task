import { PrismaClient } from '@prisma/client';
import { NextFunction } from 'express';
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const secretKey = process.env.JWT_SECRET || 'secretkey';
const { v4: uuid } = require('uuid');



const prismaClient = new PrismaClient();
prismaClient.$connect();


const app = express();
app.use(cors())
app.use(express.json());
const PORT = 5000;

const verifyToken = (req: any, res: any, next: NextFunction) => {
    const authHeader = req.headers && req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach user information to the request
        next();
    } catch (e) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

app.post('/api/v1/auth/register/', async (req: any, res: any) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        res.status(400).json({ message: 'Passwords do not match' });
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prismaClient.users.create({
        data: {
            id: `user_${uuid()}`,
            firstName,
            lastName,
            email,
            password: hashedPassword
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
        }
    });
    res.status(201).json({ "authUser": user });
})

app.post('/api/v1/auth/login/', async (req: any, res: any) => {
    const { email, password } = req.body;
    const user: any = await prismaClient.users.findUnique({
        where: {
            email
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            isSuperUser: true
        }
    });
    if (!user) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
    }

    delete user.password;
    const accessToken = jwt.sign({ user: user }, secretKey, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ user: user }, secretKey, { expiresIn: '7d' });
    res.status(200).json({ authUser: user, accessToken, refreshToken });
});

app.post('/api/v1/auth/refresh/', async (req: any, res: any) => {
    const { refreshToken } = req.body;
    try {
        const decoded = jwt.verify(refreshToken, secretKey);
        const accessToken = jwt.sign({ user: decoded.user }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ accessToken });
    } catch (e) {
        res.status(400).json({ message: 'Invalid token' });
    }
});

app.get('/api/v1/auth/users/', [verifyToken], async (req: any, res: any) => {
    if (!req.user || !req.user.user.isSuperUser) {
        return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }
    const users = await prismaClient.users.findMany();
    res.status(200).json(users);
})


app.get('/api/v1/events/', [verifyToken], async (req: any, res: any) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    let { page = 1, limit = 10, actorId, actionId, targetId, actorName, actionName, targetName, query } = req.query;
    const filters = [
        actorName && {
            OR: [
                { actor: { firstName: { contains: actorName, mode: 'insensitive' } } },
                { actor: { lastName: { contains: actorName, mode: 'insensitive' } } },
            ]
        },
        actionName && { action: { name: { contains: actionName, mode: 'insensitive' } } },
        targetName && {
            OR: [
                { target: { firstName: { contains: targetName, mode: 'insensitive' } } },
                { target: { lastName: { contains: targetName, mode: 'insensitive' } } },
            ]
        },
        query && {
            OR: [
                { actor: { firstName: { contains: query, mode: 'insensitive' } } },
                { actor: { lastName: { contains: query, mode: 'insensitive' } } },
                { action: { name: { contains: query, mode: 'insensitive' } } },
                { target: { firstName: { contains: query, mode: 'insensitive' } } },
                { target: { lastName: { contains: query, mode: 'insensitive' } } }
            ]
        }
    ].filter(Boolean);

    const events = await prismaClient.events.findMany({
        where: {
            AND: [
                {
                    actorId: actorId ?? undefined,
                    actionId: actionId ?? undefined,
                    targetId: targetId ?? undefined,
                },
                filters.length > 0 ? { OR: filters } : {}
            ]
        },
        include: {
            actor: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                }
            },
            action: {
                select: {
                    id: true,
                    name: true
                }
            },
            target: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                }
            }
        },
        skip: (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10),
        take: parseInt(limit as string, 10),
        orderBy: [
            { occurredAt: 'desc' },
            { id: 'asc' }
        ],
    });

    // count the total number of filtered events
    const allEveentsCount = await prismaClient.events.count({
        where: {
            AND: [
                {
                    actorId: actorId ?? undefined,
                    actionId: actionId ?? undefined,
                    targetId: targetId ?? undefined,
                },
                filters.length > 0 ? { OR: filters } : {}
            ]
        }
    });

    res.status(200).json({
        previous: parseInt(page) > 1 ? `${req.protocol}://${req.get('host')}${req.originalUrl}?page=${parseInt(page) - 1}&limit=${limit}` : null,
        next: allEveentsCount > (parseInt(page) * parseInt(limit)) ? `${req.protocol}://${req.get('host')}${req.originalUrl}?page=${parseInt(page) + 1}&limit=${limit}` : null,
        data: events
    });
})

app.post('/api/v1/events/', [verifyToken], async (req: any, res: any) => {
    if (!req.user || !req.user.user.isSuperUser) {
        return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }
    const { actorId, actionId, targetId } = req.body;
    // get remote ip address
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const location = ip
    const event = await prismaClient.events.create({
        data: {
            id: `event_${uuid()}`,
            actorId,
            actionId,
            targetId,
            location
        }
    });
    res.status(201).json(event);
})


app.get('/api/v1/actions/', [verifyToken], async (req: any, res: any) => {
    const actions = await prismaClient.actions.findMany();
    res.status(200).json(actions);
})


app.listen(PORT, () => {
    console.log(`app started listening on port ${PORT}`)
})
