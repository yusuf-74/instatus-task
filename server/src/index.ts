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




app.listen(PORT, () => {
    console.log(`app started listening on port ${PORT}`)
})
