import SessionItem from "./SessionItem";

export default function SessionList(props) {
    const {
        sessions,
        current,
        setCurrent,
        renameSession,
        deleteSession,
        collapsed,
    } = props;

    return (
        <div className="flex-1 overflow-y-auto">
            <ul>
                {sessions.map((s) => (
                    <SessionItem
                        key={s.id}
                        s={s}
                        current={current}
                        collapsed={collapsed}
                        setCurrent={setCurrent}
                        renameSession={renameSession}
                        deleteSession={deleteSession}
                    />
                ))}
            </ul>
        </div>
    );
}
