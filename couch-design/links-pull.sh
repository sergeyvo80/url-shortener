#!/usr/bin/env bash
# for dev only
curl -X PUT http://127.0.0.1:5984/url-shortener/_design/links --data-binary @links.json
