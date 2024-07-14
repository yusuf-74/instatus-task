import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import Avatar from '../../components/Avatar';
import EventDetailsCard from './EventDetailsCard';
import FiltersModal from './FiltersModal';
import { useQuery } from '@tanstack/react-query';
import { EVENTS_APIS } from '../../apis/apis';
import generateExcel from '../../Utils/generateCsv';

const formatDateTimestamp = (timestamp = Date.now()) => {
    const date = new Date(timestamp);
    // turn to -> Mon d, time (AM/PM)
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });

};

const EventsIndex = () => {
    const [expandedRow, setExpandedRow] = useState(null);
    const [isLive, setIsLive] = useState(false);
    const [eventsData, setEventsData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10
    });
    const [filters, setFilters] = useState({
        actorId: null,
        actionId: null,
        targetId: null,
        actorName: null,
        actionName: null,
        targetName: null,
        query: null,
    })
    const [search, setSearch] = useState('');

    const EventsQuery = useQuery({
        queryKey: ['events', pagination, filters],
        queryFn: async () => {
            return await EVENTS_APIS.listEvents(pagination, filters);
        },
        // if is live, refetch every 5 seconds
        refetchInterval: isLive ? 5000 : false,
        refetchIntervalInBackground: true,
        retry: 2,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        gcTime: isLive ? 1000 * 60 * 60 : 1000 * 60 * 60 * 24,
    })

    useEffect(() => {
        if (EventsQuery.data && !isLive) {
            setEventsData(prev => {
                return [...prev, ...EventsQuery.data.data];
            });
        }
        else if (EventsQuery.data && isLive) {
            setEventsData(EventsQuery.data.data);
        }

    }, [EventsQuery.data, pagination])

    useEffect(() => {
        setEventsData([]);
        setPagination({
            page: 1,
            limit: 10
        });
    }, [filters, isLive])

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const handleLoadMore = () => {
        setPagination({
            ...pagination,
            page: pagination.page + 1
        });
    };

    const handleCsvDownload = () => {
        const fileName = `Events_Actor_${filters.actorName || 'All'}_Action_${filters.actionName || 'All'}_Target_${filters.targetName || 'All'}_Query_${filters.query || 'All'}_${Date.now()}`;
        generateExcel(eventsData, fileName);
    }

    return (
        <>
            <FiltersModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} filters={filters} setFilters={setFilters} />
            <div className="container mx-auto" style={{
                border: '1px solid #E0E0DF',
                borderRadius: '8px'
            }}>
                <table className="min-w-full bg-white border-separate border-spacing-0">
                    <thead className="bg-gray-100">
                        <tr>
                            <th colSpan="3" className="py-2 px-4">
                                <div className="flex justify-between items-center">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && setFilters({ ...filters, query: search })}
                                        className="bg-gray-100 border p-2 rounded outline-none flex-1 font-inter text-[14px]"
                                        style={{
                                            fontWeight: 400,
                                            border: '1px solid #E0E0DF',
                                            borderRadius: '4px 0 0 4px'
                                        }}
                                    />
                                    <button className="bg-gray-100 border p-2 font-inter text-[14px] flex items-center" style={{
                                        fontWeight: 400,
                                        border: '1px solid #E0E0DF'
                                    }}
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        <svg width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                                            marginRight: '5px'
                                        }}>
                                            <path d="M14.25 2.25H0.75C0.551088 2.25 0.360322 2.17098 0.21967 2.03033C0.0790177 1.88968 0 1.69891 0 1.5C0 1.30109 0.0790177 1.11032 0.21967 0.96967C0.360322 0.829018 0.551088 0.75 0.75 0.75H14.25C14.4489 0.75 14.6397 0.829018 14.7803 0.96967C14.921 1.11032 15 1.30109 15 1.5C15 1.69891 14.921 1.88968 14.7803 2.03033C14.6397 2.17098 14.4489 2.25 14.25 2.25ZM11.75 5.75H3.25C3.05109 5.75 2.86032 5.67098 2.71967 5.53033C2.57902 5.38968 2.5 5.19891 2.5 5C2.5 4.80109 2.57902 4.61032 2.71967 4.46967C2.86032 4.32902 3.05109 4.25 3.25 4.25H11.75C11.9489 4.25 12.1397 4.32902 12.2803 4.46967C12.421 4.61032 12.5 4.80109 12.5 5C12.5 5.19891 12.421 5.38968 12.2803 5.53033C12.1397 5.67098 11.9489 5.75 11.75 5.75ZM8.75 9.25H6.25C6.05109 9.25 5.86032 9.17098 5.71967 9.03033C5.57902 8.88968 5.5 8.69891 5.5 8.5C5.5 8.30109 5.57902 8.11032 5.71967 7.96967C5.86032 7.82902 6.05109 7.75 6.25 7.75H8.75C8.94891 7.75 9.13968 7.82902 9.28033 7.96967C9.42098 8.11032 9.5 8.30109 9.5 8.5C9.5 8.69891 9.42098 8.88968 9.28033 9.03033C9.13968 9.17098 8.94891 9.25 8.75 9.25Z" fill="#575757" />
                                        </svg>
                                        FILTER
                                    </button>
                                    <button className="bg-gray-100 border p-2 font-inter text-[14px] flex items-center" style={{
                                        fontWeight: 400,
                                        border: '1px solid #E0E0DF'
                                    }}
                                        onClick={handleCsvDownload}>
                                        <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                                            marginRight: '5px'
                                        }}>
                                            <path d="M9.01562 4.6875H5.96875V9.18076L7.5124 7.6374C7.60103 7.55321 7.71903 7.50696 7.84127 7.50852C7.9635 7.51009 8.08028 7.55934 8.16672 7.64578C8.25316 7.73222 8.30241 7.849 8.30398 7.97123C8.30554 8.09347 8.25929 8.21147 8.1751 8.3001L5.83135 10.6438C5.74345 10.7317 5.62427 10.781 5.5 10.781C5.37573 10.781 5.25655 10.7317 5.16865 10.6438L2.8249 8.3001C2.74071 8.21147 2.69446 8.09347 2.69602 7.97123C2.69759 7.849 2.74684 7.73222 2.83328 7.64578C2.91972 7.55934 3.0365 7.51009 3.15874 7.50852C3.28097 7.50696 3.39897 7.55321 3.4876 7.6374L5.03125 9.18076V4.6875H1.98438C1.5494 4.68797 1.13237 4.86097 0.824792 5.16854C0.517216 5.47612 0.344215 5.89315 0.34375 6.32812V12.4219C0.344215 12.8569 0.517216 13.2739 0.824792 13.5815C1.13237 13.889 1.5494 14.062 1.98438 14.0625H9.01562C9.4506 14.062 9.86763 13.889 10.1752 13.5815C10.4828 13.2739 10.6558 12.8569 10.6562 12.4219V6.32812C10.6558 5.89315 10.4828 5.47612 10.1752 5.16854C9.86763 4.86097 9.4506 4.68797 9.01562 4.6875ZM5.96875 1.40625C5.96875 1.28193 5.91936 1.1627 5.83146 1.07479C5.74355 0.986886 5.62432 0.9375 5.5 0.9375C5.37568 0.9375 5.25645 0.986886 5.16854 1.07479C5.08064 1.1627 5.03125 1.28193 5.03125 1.40625V4.6875H5.96875V1.40625Z" fill="#575757" />
                                        </svg>
                                        EXPORT
                                    </button>
                                    <button
                                        className="bg-gray-100 border p-2 font-inter text-[14px] flex items-center"
                                        style={{
                                            fontWeight: 400,
                                            border: '1px solid #E0E0DF',
                                            borderRadius: '0 4px 4px 0'
                                        }}
                                        onClick={() => setIsLive(!isLive)}
                                    >
                                        {isLive ? (
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '5px' }}>
                                                <circle cx="6" cy="6" r="6" fill="#399918" />
                                            </svg>
                                        ) : (
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '5px' }}>
                                                <circle cx="6" cy="6" r="6" fill="#8F485D" />
                                            </svg>
                                        )}
                                        LIVE
                                    </button>
                                </div>
                            </th>
                        </tr>
                        <tr>
                            <th className="py-2 px-4 text-left text-gray-600 font-inter text-[14px] leading-[16.94px]" style={{ fontWeight: 600 }}>Actor</th>
                            <th className="py-2 px-4 text-left text-gray-600 font-inter text-[14px] leading-[16.94px]" style={{ fontWeight: 600 }}>Action</th>
                            <th className="py-2 px-4 text-left text-gray-600 font-inter text-[14px] leading-[16.94px]" style={{ fontWeight: 600 }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventsData.map(item => (
                            <React.Fragment key={item.id}>
                                <tr onClick={() => toggleRow(item.id)} className="cursor-pointer">
                                    <td className="py-2 px-4 font-inter text-[14px] font-normal leading-[16.94px] flex items-center">
                                        <Avatar name={item.actor.email} />
                                        <div className='ml-3'>
                                            {item.actor.email}
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 font-inter text-[14px] font-normal leading-[16.94px]">{item.action.name}</td>
                                    <td className="py-2 px-4 font-inter text-[14px] font-normal leading-[16.94px]">{formatDateTimestamp(item.occurredAt)}</td>
                                </tr>
                                {expandedRow === item.id && (
                                    <tr>
                                        <td colSpan="3" className="py-2">
                                            <div className="bg-gray-100 p-4 relative w-[102.5%] -ml-[1.25%] border bg-white rounded">
                                                <EventDetailsCard actionId={"action_123"}
                                                    actionName={item.action.name}
                                                    actorName={`${item.actor.firstName} ${item.actor.lastName}`}
                                                    actorEmail={item.actor.email}
                                                    actorId={item.actor.id}
                                                    date={formatDateTimestamp(item.occurredAt)}
                                                    location={item.location}
                                                    redirect={""}
                                                    targetName={`${item?.target?.firstName} ${item?.target?.lastName}`}
                                                    targetId={item?.target?.id}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                {EventsQuery?.data?.next && !isLive && (
                    <div>
                        <button
                            className="p-2 font-inter text-[14px] bg-gray-100 text-gray-700 flex items-center justify-center"
                            style={{
                                fontWeight: 400,
                                borderTop: '1px solid #E0E0DF',
                                width: '100%'
                            }}
                            onClick={handleLoadMore}
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </>

    );
};

export default EventsIndex;
