# “When Lambo?” (as a service)
Given a cryptocurrency code and the amount of it you are holding, returns whether you can buy a Lamborghini or not.

[Try a live demo](http://when-lambo.herokuapp.com/api)

## Usage
The API has a single endpoint requiring two query parameters:
```
/api/?coin={COIN}&amount={AMOUNT}
```

Response model:
```
{
    "when_lambo": String // "not yet" or "now"
}
```

### Example

```
$ curl -i "when-lambo.herokuapp.com/api?coin=BTC&amount=0.5"
HTTP/1.1 200 OK
Etag: 8d988e0ffcfd1c5639d80e5f0b7b8dfb
Content-Type: application/json; charset=utf-8
Content-Length: 24
...

{"when_lambo":"not yet"}
```

### Entity Tagging

To reduce load on your client, you can use the `ETag` header from the response above  in an `If-None-Match` header in your request to get a `304 Not Modified` when the response entity hasn’t changed for the given request.

```
$ curl -i -H "If-None-Match: 4caf48a872d2ab065eff31edbf74c5fe" "when-lambo.herokuapp.com/api?coin=DENT&amount=40000"
HTTP/1.1 304 Not Modified
Content-Length: 0
...
```

### Errors

Invalid requests will return an `‘application/problem+json` entity:
```
$ curl "when-lambo.herokuapp.com/api?coin=nonexistantCoin&amount=1" -i
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json; charset=utf-8
Content-Length: 55
...

{"error":"unable to retrieve price of NONEXISTANTCOIN"}
```

## How much is a Lamborghini anyway?
I wasn’t sure so I asked [Wolfram|Alpha](http://www.wolframalpha.com/input/?i=lamborghini+cost+2018&assumption=%7B%22C%22,+%22lamborghini%22%7D+-%3E+%7B%22AutomobileManufacturer%22%7D&assumption=%7B%22DPClash%22,+%22AutomobileManufacturerP%22,+%22cost%22%7D+-%3E+%7B%22MSRPPrice%22%7D). The API uses the constant USD $296,100 for calculations.

## Motivation 
I accidentally came across [this challenge](https://hackclub.com/workshops/challenge_ridiculous_api/) - and who can say no to a good challenge? Also I have very little NodeJS experience so it was a good learning opportunity.

## Licence
MIT

