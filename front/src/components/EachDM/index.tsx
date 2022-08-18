import gravatar from 'gravatar';

import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { NavLink, useLocation } from 'react-router-dom';
import useSWR from 'swr';

interface Props {
  member: IUser;
  isOnline: boolean;
}
const EachDM: React.VFC<Props> = ({ member, isOnline }) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const date = localStorage.getItem(`${workspace ?? ''}-${member.id}`) || 0;
  const { data: count, mutate } = useSWR<number>(
    userData ? `/api/workspaces/${workspace ?? ''}/dms/${member.id}/unreads?after=${date}` : null,
    fetcher,
  );

  useEffect(() => {
    if (location.pathname === `/workspace/${workspace ?? ''}/dm/${member.id}`) {
      mutate(0);
    }
  }, [mutate, location.pathname, workspace, member]);

  return (
    <NavLink
      key={member.id}
      activeClassName="selected"
      to={`/workspace/${workspace ?? ''}/dm/${member.id}`}
    >
      {/* <i
        className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
          isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
        }`}
        aria-hidden="true"
        data-qa="presence_indicator"
        data-qa-presence-self="false"
        data-qa-presence-active="false"
        data-qa-presence-dnd="false"
      /> */}
      <img
        src={gravatar.url(userData?.email ?? 'default@estsecurity.com', { s: '28px', d: 'retro' })}
        alt={userData?.nickname}
        style={{ marginRight: 5 }}
      />
      <span className={count && count > 0 ? 'bold' : undefined}>{member.nickname}</span>
      {member.id === userData?.id && <span> (나)</span>}
      {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
      {(count && count > 0 && <span className="count">{count}</span>) || null}
    </NavLink>
  );
};

export default EachDM;
