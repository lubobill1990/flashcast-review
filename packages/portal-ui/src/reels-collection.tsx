'use client'

import { Button } from "@fluentui/react-components";
// import {} from '@fluentui/react-icons';
import Link from "next/link";
import React from "react"

interface IReelsCollectionProps extends React.PropsWithChildren{
  status: string;
  clipThumnails: string[];
  createdDate: string;
  url: string;
}
export const ReelsCollection: React.FC<IReelsCollectionProps> = ({
  status,
  clipThumnails,
  createdDate,
  url,
}) => {
  return <div style={{display: 'flex', justifyContent: 'space-between'}}>
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <div><strong>{clipThumnails.length} Reels</strong> generated from <strong>Recording title</strong><span style={{background: '#13A10E', borderRadius: '4px', color: '#FFFFFF'}}>{status}</span></div>
      <div>{createdDate}</div>
      <div><Link href={url}><Button>View all</Button></Link></div>
    </div>
    <div>
      <ul>
        {clipThumnails.map(t => <li key={t}>{t}</li>)}
      </ul>
    </div>
  </div>;
}

