<aura:application extends="force:slds"
                  description="Used in development to host UI components and refresh them quickly">

    <aura:attribute name="diagram" type="Object"/>

    <ltng:require scripts="{!join(',', $Resource.pure)}"
                  afterScriptsLoaded="{!c.doInit}"/>

    <c:SOQLRenderer aura:id="soql" diagram="{!v.diagram}"/>

</aura:application>
