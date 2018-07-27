public Class BuilderSourceType{
    @AuraEnabled
    public String sourceType;
    @AuraEnabled
    public String label;
    @AuraEnabled
    public String description;
    @AuraEnabled
    public String apexClass;
    @AuraEnabled
    public String configComponent;
    public BuilderSourceType(Graphviz_AutoBuild__mdt metaData) {
        this.sourceType = metaData.DeveloperName;
        this.label = metaData.Label;
        this.description = metaData.Description__c;
        this.apexClass = metaData.Apex_Class__c;
        this.configComponent = metaData.Lightning_Config_Component__c;
    }
}