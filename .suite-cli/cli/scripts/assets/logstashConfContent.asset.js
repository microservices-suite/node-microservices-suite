module.exports = () =>`
input {
  gelf {
    port => 12201
  }
}

filter {
    # Grok expression matches several formats (EE and CE):
    #[GIN] 2022/09/09 - 08:33:51 | 200 |     732.753µs |      172.20.0.1 | GET      "/sequential"
    #[SUITE] 2022/09/09 - 08:35:25.813 [AccessLog] | 200 | 92.944122ms |      172.20.0.1 | GET      /market/simple
    #[SUITE][SERVICE: AsyncAgent][AMQP][async-agent-demo] Starting the consumer
    grok {
        match => { "message" => '(\[%{WORD}\] %{DATA}%{SPACE}-%{SPACE}%{DATA}%{SPACE}(\[AccessLog\]%{SPACE})?\| %{NUMBER:statusCode} \|%{SPACE}%{NUMBER:duration}(m|µ|n|u)?s%{SPACE}\|%{SPACE}%{DATA:ip}%{SPACE}\|%{SPACE}%{WORD:verb}%{SPACE}"?(?<url>[^"]+)"?)?((\[SUITE\])?\[%{WORD:scope}(: (?<context>[^\]]+)(\]\[%{DATA:sublevel1})?(\]\[%{DATA:sublevel2})?)?\] %{GREEDYDATA:msg})?'}
    }

    if [host] and ![host][name] {
        mutate {
            rename => { "[host]" => "[host][name]" }
        }
    }
    mutate {
    convert => {
      "statusCode" => "integer"
      "duration" => "float"
  }
}
}

output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
  }
  stdout {
    codec => rubydebug
  }
}
`