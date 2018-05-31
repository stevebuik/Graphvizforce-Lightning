global class ToolingAPIMocks implements HttpCalloutMock {

    private Map<RestRequest, RestResponse> responses = new Map<RestRequest, RestResponse>();

    // ignoring the request body since tests don't benefit from including it
    public class RestRequest {
        String method;
        String uri;
        Map<String, String> params;
        public RestRequest(String method, String uri, Map<String, String> params) {
            this.method = method;
            this.uri = uri;
            this.params = params;
        }
        public Integer hashCode() {
            String k = '' + method.hashCode() + uri.hashCode() + params.hashCode();
            return k.hashCode();
        }
        public Boolean equals(Object other) {
            RestRequest otherRequest = (RestRequest) other;
            return this.hashCode() == otherRequest.hashCode();
        }
    }

    public class RestResponse {
        Exception e;
        String body;
        Integer statusCode;
        public RestResponse(Exception e) {
            this.e = e;
        }
        public RestResponse(Integer statusCode, String body) {
            this.body = body;
            this.statusCode = statusCode;
        }
    }

    public ToolingAPIMocks(Map<RestRequest, RestResponse> responses) {
        this.responses = responses;
    }

    public static final Integer HTTP_OK = 200;
    public static final Integer HTTP_DELETED = 204;
    public static final Integer HTTP_CREATED = 201;

    global HttpResponse respond(HttpRequest request) {

        PageReference requestReference = new PageReference(request.getEndpoint());
        Url url = new Url(request.getEndpoint());

        RestRequest req = new RestRequest(request.getMethod(), url.getPath(), requestReference.getParameters());
        RestResponse res = responses.get(req);

        if (res == NULL) {
            throw new System.UnsupportedOperationException('Request not mocked: ' + req);
        } else {
            if (res.e != NULL) {
                throw res.e;
            }

            HttpResponse response = new HttpResponse();
            response.setStatusCode(res.statusCode);
            if (res.body.length() > 0) {
                response.setBody(res.body);
            }
            return response;
        }
    }


}