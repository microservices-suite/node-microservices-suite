module.exports = () => (
    [
        {
            directory: 'elastic',
            subdirectories: []
        },
        {
            directory: 'grafana',
            subdirectories: [
                'dashboards',
                'datasources',
                'krakend'
            ]
        },
        {
            directory: 'krakend',
            subdirectories: [
                'partials',
                'settings',
                'templates'
            ]
        },
        {
            directory: 'logstash',
            subdirectories: []
        },
        {
            directory: 'logstash',
            subdirectories: []
        }
    ]
)