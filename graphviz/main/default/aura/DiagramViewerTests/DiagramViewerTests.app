<aura:application description="">

    <c:lts_jasmineRunner testFiles="{!join(',',
            $Resource.GVF2TestsJasmine + '/DiagramViewerTests.js'
            )}"/>

</aura:application>
