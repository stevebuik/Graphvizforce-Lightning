# SFDX  App

## Dev, Build and Test

Login and set default dev hub org:

`sfdx force:auth:web:login --setdefaultdevhubusername --setalias my-hub-org`

Create a new scratch org:

`sfdx force:org:create --definitionfile config/project-scratch-def.json --setalias scratch1 --setdefaultusername`

List all orgs:

`sfdx force:org:list`

Open/login to new (default) scratch org:

`sfdx force:org:open --path one/one.app`

Deploy code (ensure you are in gvf2 dir):

`sfdx force:source:push`

Assign permission set to access App/Tab:

`sfdx force:user:permset:assign --permsetname graphvizforce`



## Resources


## Description of Files and Directories


## Issues


