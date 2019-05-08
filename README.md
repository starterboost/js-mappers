# JavaScript Mappers

A set of classes and utilities to help with the management of onAdd/onUpdate/onRemove of items and properties to Arrays and Objects

## ArrayMapper

[Example: ArrayMapper Basic](examples/array/basic.js)
```javascript
import {ArrayMapper} from '../../'

let mapper = new ArrayMapper({
	//onAdd handler
	onAdd : (item) => console.log('\tonAdd', item),
	//onUpdate handler
	onUpdate : (item) => console.log('\tonUpdate', item),
	//onRemove handler
	onRemove : (item) => console.log('\tonRemove', item)
});

let items = [
	{id:1}
];

//call mapper the first time with full array
console.log('initial call...')
mapper.update( items );

// > 'onAdd', {id:1}

//call again
console.log('repeated call...')
mapper.update( items );

// > 'onUpdate', {id:1}

//call again with empty array
console.log('empty call...')
mapper.update( [] );

// > 'onRemove', {id:1}
```