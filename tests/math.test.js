const {calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add} = require('../src/math')

test('Calc total with tip', () => {
    const total = calculateTip(10, .3)
    expect(total).toBe(13)
}) 

test('Calc total with default tip', () => {
    const total = calculateTip(10)
    expect(total).toBe(12)
}) 

test('fahrenheitToCelsius', () => {
    const temp = fahrenheitToCelsius(32)
    expect(temp).toBe(0)
}) 
test('celsiusToFahrenheit', () => {
    const temp = celsiusToFahrenheit(0)
    expect(temp).toBe(32)
}) 

// test('Async test demo', (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2)
//         done()
//     }, 2000)
    
// })

test('Should add two number', (done) => {
    add(2,3).then((sum) => {
        expect(sum).toBe(5)
        done()
    })
})

test('Should add two number async await', async () => {
    const sum = await add(11, 22)
    expect(sum).toBe(33)
})