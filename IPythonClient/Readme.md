### State
 
```javascript
{
  environment: {
    python: {
      version: "2.7.11"
    },
    os: {
      name: "osx",
      version: "10.8"
    }
  },
  history: [
    {
      "source": "print 'hello'",
      "response": "'hello'",
      "runtime_ms": 1000,
      "start_time_ms": 12345869,
      "hash": "deadbeef",
    },
    ...
  ]
}
```
 
 ### Note: 
 
 - Tests don't work when run from webstorm (env not loaded properly)