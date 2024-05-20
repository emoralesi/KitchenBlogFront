import NotificationBell from "./Notifications"

export const Header = () => {
    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: 'pink', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <NotificationBell />
        </div>
    )
}