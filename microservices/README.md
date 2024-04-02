# Microservices Suite

## microservices folder

All services are packaged using [Domain Driven Desing(DDD)](https://learn.microsoft.com/en-us/archive/msdn-magazine/2009/february/best-practice-an-introduction-to-domain-driven-design) and isolated from her peers. [Domain model mapping](https://www.oreilly.com/library/view/what-is-domain-driven/9781492057802/ch04.html) should balance between `cohesive business logic` vs `separating concerns` by drawing accurate estimates of `bounded contexts`. Checkout microservices book by [Sam Newman 👉here](https://samnewman.io/)

Domain-model boundary
- This should be designed around logical business separation and not size. 
- Though always tend towards small sizes as long as you maintain logical business separation(cohesion)
- So use cohesion as a way to identify how to break apart or group microservices
- Design your ms based on the bound context of DDD design.  
- A good ms should have an autonomous BC, as isolated as possible, that enables you to work without constantly switching to other contexts (other microservice models).
