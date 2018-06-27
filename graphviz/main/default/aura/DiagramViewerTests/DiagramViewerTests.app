<aura:application description="">

    <gvf2:lts_jasmineRunner testFiles="{!join(',',
            $Resource.GVF2TestsJasmine + '/DiagramViewerTests.js'
            )}"/>

</aura:application>
