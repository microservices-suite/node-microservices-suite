module.exports = () =>`
apiVersion: 1

datasources:
-  access: 'proxy'
   editable: true
   is_default: true
   name: 'influx'
   org_id: 1
   type: 'influxdb'
   url: 'http://influxdb:8086'
   version: 1
   user: krakend-dev
   password: pas5w0rd
   database: krakend
`