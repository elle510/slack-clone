import { ChatWrapper } from '@components/Chat/styles';
import { IChat, IDM, IUser } from '@typings/db';
import dayjs from 'dayjs';
import gravatar from 'gravatar';
import React, { useMemo, memo } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import regexifyString from 'regexify-string';

interface Props {
  data: IDM | IChat;
}

const BACK_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3095' : 'https://sleact.nodebird.com';
// eslint-disable-next-line react/display-name
const Chat: React.FC<Props> = memo(({ data }: Props) => {
  const { workspace } = useParams<{ workspace: string; channel: string }>();
  const user: IUser = 'Sender' in data ? data.Sender : data.User;

  // eslint-disable-next-line @typescript-eslint/array-type
  const result = useMemo<(string | JSX.Element)[] | JSX.Element>(
    () =>
      data.content.startsWith('uploads\\') || data.content.startsWith('uploads/') ? (
        <img src={`${BACK_URL}/${data.content}`} style={{ maxHeight: 200 }} />
      ) : (
        regexifyString({
          pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
          decorator(match, index) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
            if (arr) {
              return (
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                  @{arr[1]}
                </Link>
              );
            }
            return <br key={index} />;
          },
          input: data.content,
        })
      ),
    [workspace, data.content],
  );

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
});

export default Chat;
