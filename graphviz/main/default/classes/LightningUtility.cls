/**
 * Created by guan on 20/6/18.
 */

public class LightningUtility {


    public class ResultWrapper {
        public ServiceStatus serviceStatus;
        public Object result;

        public ResultWrapper() {
            serviceStatus = new ServiceStatus();
        }

        public void setMessage(String message) {
            serviceStatus.message = message;
        }
    }

    public enum ServiceStatusEnum {
        success, failure, warning, information
    }

    public class ServiceStatus {
        public ServiceStatusEnum status;
        public String message;
        public DateTime timestamp;

        public ServiceStatus() {
            this.status = ServiceStatusEnum.Success;
            this.timestamp = DateTime.now();
        }

        public ServiceStatus(String message, ServiceStatusEnum status) {
            this.message = message;
            this.status = status;
            this.timestamp = DateTime.now();
        }
    }
}