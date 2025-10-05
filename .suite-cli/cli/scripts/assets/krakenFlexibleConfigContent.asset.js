module.exports = ({answers}) => `
{
    "$schema": "https://www.krakend.io/schema/v3.json",
    "version": 3,
    "name": "Sample Gateway",
    "port": {{ .env.port }},
    "timeout": \"${answers.gateway_timeout}s",
    "cache_ttl": \"${answers.gateway_cache_period}s",
    "extra_config": {{ include "extra_config.tmpl" }},
    "endpoints": [
      {{ template "sample_template.tmpl" . }},

      {{ range $idx, $endpoint := .loop_example.dummy }}
        {{ if $idx }},{{ end }}
        {
            "endpoint": "{{ $endpoint }}",
            "backend": [
              {
                "host": [ "http://localhost:${answers.gateway_port}" ],
                "url_pattern": "/__debug{{ $endpoint }}"
              }
            ]
        }
      {{ end }}
   ]
}
`
