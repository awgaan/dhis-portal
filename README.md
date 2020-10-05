## DHIS Portal

Creates a proxy to a DHIS2 instance and functions as a workaround for
[SameSite cookie policy
problems](https://developers.dhis2.org/2020/08/cross-origin-cookies/).

### Installation

```shell
// yarn
yarn global add dhis-portal

// npm
npm install --global dhis-portal
```

### Usage

```text
dhis2-portal --server=<server-name>
             --instance=<instance-name>
             [--port=<port>]
             [--target=<instance-url>]
             [--verbose]
```

#### Example

```shell
$ dhis-portal --server=play --instance=2.34.1
Portal from localhost:9999 -> https://play.dhis2.org/2.34.1 created!
```
