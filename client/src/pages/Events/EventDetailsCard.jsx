import React from 'react';
import 'tailwindcss/tailwind.css';

const EventDetailsCard = ({
    actorName,
    actorEmail,
    actorId,
    actionName,
    actionId,
    date,
    location,
    redirect,
    targetName,
    targetId
}) => {
    const sectionStyle = {
        color: '#929292'
    };

    const renderSection = (title, content) => (
        <div className="w-1/3">
            <h2 className="font-semibold mb-2" style={sectionStyle}>{title}</h2>
            {content}
        </div>
    );

    return (
        <div className="bg-white">
            <div className="flex justify-between mb-4">
                {renderSection('Actor', (
                    <>
                        <p style={{
                            marginBottom: '4px'
                        }}><span style={sectionStyle}>Name:</span> {actorName}</p>
                        <p style={{
                            marginBottom: '4px'
                        }}><span style={sectionStyle}>Email:</span> {actorEmail}</p>
                        <p style={{
                            marginBottom: '4px'
                        }}><span style={sectionStyle}>ID:</span> {actorId}</p>
                    </>
                ))}
                {renderSection('Action', (
                    <>
                        <p style={{
                            marginBottom: '4px'
                        }}><span style={sectionStyle}>Name:</span> {actionName}</p>
                        <p style={{
                            marginBottom: '4px'
                        }}><span style={sectionStyle}>ID:</span> {actionId}</p>
                    </>
                ))}
                {renderSection('Date', <p style={{
                    marginBottom: '4px'
                }}>{date}</p>)}
            </div>
            <div className="flex justify-start">
                {renderSection('Metadata', (
                    <>
                        <p style={{
                            marginBottom: '4px'
                        }}><span style={sectionStyle}>Location:</span> {location}</p>
                        <p style={{
                            marginBottom: '4px'
                        }}><span style={sectionStyle}>Redirect:</span> {redirect}</p>
                    </>
                ))}
                {renderSection('Target', (
                    <>
                        <p style={{
                            marginBottom: '4px'
                        }}><span style={sectionStyle}>Name:</span> {targetName}</p>
                        <p style={{
                            marginBottom: '4px'
                        }}><span style={sectionStyle}>ID:</span> {targetId}</p>
                    </>
                ))}
            </div>
        </div>
    );
};

export default EventDetailsCard;
