'use client';

import { HiCheck, HiPencil, HiXMark } from 'react-icons/hi2';
import moment from 'moment';

interface ApprovalHistoryProps {
  data: any;
  title: string;
}

export default function ApprovalHistory({ data, title }: ApprovalHistoryProps) {
  return (
    <div className='mt-8'>
      <h3 className='text-lg font-medium text-gray-600 underline'>
        {title} history
      </h3>
      <div className='flow-root bg-gray-100 px-6 py-6 mt-3 rounded-[10px]'>
        <ul role='list'>
          {data?.map((event: any, eventIdx: number) => (
            <li key={event._id}>
              <div className='relative'>
                {eventIdx !== data.length - 1 ? (
                  <span
                    className='absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200'
                    aria-hidden='true'
                  />
                ) : null}
                <div className='relative flex space-x-3'>
                  <div>
                    <span
                      className={`${
                        event.content_status === 0
                          ? 'bg-gray-400'
                          : event.content_status === 1
                            ? 'bg-green-400'
                            : 'bg-red-400'
                      } h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white shadow-3xl`}
                    >
                      {event.content_status === 0 && (
                        <HiPencil className='w-5 h-5 text-white' />
                      )}
                      {event.content_status === 1 && (
                        <HiCheck className='w-5 h-5 text-white' />
                      )}
                      {event.content_status === 2 && (
                        <HiXMark className='w-5 h-5 text-white' />
                      )}
                    </span>
                  </div>
                  <div className='pl-2 w-full justify-between pt-1.5'>
                    {event.comment && (
                      <div>
                        <p className='mb-2 text-sm text-gray-500 sm:mb-1'>
                          {event.comment}{' '}
                        </p>
                      </div>
                    )}
                    <div className='flex flex-wrap justify-between text-gray-600 whitespace-nowrap'>
                      <p className='text-[15px]'>
                        {event.content_status === 1 ? (
                          <>
                            Approved by <span>{event.commented_by}</span>
                          </>
                        ) : event.content_status === 2 ? (
                          <>
                            Rejected by <span>{event.commented_by}</span>
                          </>
                        ) : (
                          <>
                            Added in draft by <span>{event.commented_by}</span>
                          </>
                        )}
                      </p>
                      <p className='text-[15px]'>
                        {moment(event.commented_on).format('lll')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
