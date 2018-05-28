public class BuilderSource {

    @AuraEnabled
    public String source;

    @AuraEnabled
    public String id;

    public BuilderSource(String source, String id) {
        this.source = source;
        this.id = id;
    }
}
