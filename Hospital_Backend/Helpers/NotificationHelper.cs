using System.Threading.Tasks;
using System.Collections.Concurrent;

namespace Smart_Hospital.Helpers
{
    public class NotificationHelper
    {
        private static ConcurrentDictionary<int, string> DoctorNotifications = new ConcurrentDictionary<int, string>();

        public async Task NotifyDoctorAsync(int doctorId, string message)
        {
            DoctorNotifications.AddOrUpdate(doctorId, message, (key, oldValue) => message);
            await Task.CompletedTask;
        }

        public string GetNotification(int doctorId)
        {
            DoctorNotifications.TryGetValue(doctorId, out var message);
            return message;
        }

        public void ClearNotification(int doctorId)
        {
            DoctorNotifications.TryRemove(doctorId, out _);
        }
    }
}
