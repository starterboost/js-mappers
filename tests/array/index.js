//required modules
const util = require('util');
const _ = require('lodash');
const assert = require('assert');
const sinon = require('sinon');

//the library we're testing
const {ArrayMapper} = require('../../');

describe('ArrayMapper', function(){
	
	it('Should provide ArrayMapper',() => {
		assert( util.isFunction( ArrayMapper ), 'Expected ArrayMapper function' )
	});

	it('Should handle onAdd', () => {
		//create a new set of mock functions
		const mockOnAdd = sinon.spy();
		const mockOnRemove = sinon.spy();
		
		let mapper = new ArrayMapper({
			onAdd : mockOnAdd,
			onRemove : mockOnRemove
		});

		let items = [
			{id:1}
		];

		//call mapper the first time with full array
		mapper.update( items );
		//initial update result
		//...onAdd called 2 times, onRemove called 0 times
		console.assert( mockOnAdd.callCount == 1, `onAdd was called ${mockOnAdd.callCount} times, expected 1` );
		console.assert( mockOnRemove.callCount == 0, `onRemove was called ${mockOnRemove.callCount} times, expected 0` );
		//...onAdd called 1 time with each of the items in the array
		_.each( items, (item, index) => {
			const mockCall = mockOnAdd.getCall( index );
			console.assert( !util.isNullOrUndefined( mockCall ), `Expected call at index '${index}'` );
			console.assert( mockCall.calledWith( item ), `Expected called with '${item}', received ${mockCall.args}` );
		} );
	});

	it('Should handle onUpdate', () => {
		//create a new set of mock functions
		const mockOnAdd = sinon.spy();
		const mockOnUpdate = sinon.spy();
		const mockOnRemove = sinon.spy();
		
		let mapper = new ArrayMapper({
			onAdd : mockOnAdd,
			onUpdate : mockOnUpdate,
			onRemove : mockOnRemove
		});

		let items = [
			{id:1}
		];

		//call mapper the first time with full array
		mapper.update( items );
		//initial update result
		//...onAdd called 1 times, onUpdate and onRemove called 0 times
		console.assert( mockOnAdd.callCount == 1, `onAdd was called ${mockOnAdd.callCount} times, expected 1` );
		console.assert( mockOnUpdate.callCount == 0, `onUpdate was called ${mockOnUpdate.callCount} times, expected 0` );
		console.assert( mockOnRemove.callCount == 0, `onRemove was called ${mockOnRemove.callCount} times, expected 0` );
		//...onAdd called 1 time with each of the items in the array
		_.each( items, (item, index) => {
			const mockCall = mockOnAdd.getCall( index );
			console.assert( !util.isNullOrUndefined( mockCall ), `Expected call at index '${index}'` );
			console.assert( mockCall.calledWith( item ), `Expected called with '${item}', received ${mockCall.args}` );
		} );

		//reset spies
		mockOnAdd.resetHistory();
		mockOnUpdate.resetHistory();
		mockOnRemove.resetHistory();
		//call update again - mockOnUpdate should be called once
		mapper.update( items );
		//...onUpdate called 1 times, onAdd and onRemove called 0 times
		console.assert( mockOnAdd.callCount == 0, `onAdd was called ${mockOnAdd.callCount} times, expected 0` );
		console.assert( mockOnUpdate.callCount == 1, `onUpdate was called ${mockOnUpdate.callCount} times, expected 1` );
		console.assert( mockOnRemove.callCount == 0, `onRemove was called ${mockOnRemove.callCount} times, expected 0` );
		//...onUpdate called 1 time with each of the items in the array
		_.each( items, (item, index) => {
			const mockCall = mockOnUpdate.getCall( index );
			console.assert( !util.isNullOrUndefined( mockCall ), `Expected call at index '${index}'` );
			console.assert( mockCall.calledWith( item ), `Expected called with '${item}', received ${mockCall.args}` );
		} );
	});

	it('Should handle onRemove', () => {
		//create a new set of mock functions
		const mockOnAdd = sinon.spy();
		const mockOnRemove = sinon.spy();
		
		let mapper = new ArrayMapper({
			onAdd : mockOnAdd,
			onRemove : mockOnRemove
		});

		let items = [
			{id:1},
			{id:2}
		];

		//call mapper the first time with full array
		mapper.update( items );
		//initial update result
		//...onAdd called 1 times, onRemove called 0 times
		console.assert( mockOnAdd.callCount == 2, `onAdd was called ${mockOnAdd.callCount} times, expected 2` );
		console.assert( mockOnRemove.callCount == 0, `onRemove was called ${mockOnRemove.callCount} times, expected 0` );
		//...onAdd called 1 times with each of the items in the array
		_.each( items, (item, index) => {
			const mockCall = mockOnAdd.getCall( index );
			console.assert( !util.isNullOrUndefined( mockCall ), `Expected call at index '${index}'` );
			console.assert( mockCall.calledWith( item ), `Expected called with '${item}', received ${mockCall.args}` );
		} );
		
		//remove one of the items
		const itemToRemove = _.find( items, {id:1} );
		items = _.without( items, itemToRemove );
		//reset spies
		mockOnAdd.resetHistory();
		mockOnRemove.resetHistory();
		//call again with an item removed
		mapper.update( items );
		//secondary update result
		//...onAdd called 0 times, onRemove called 1 times
		console.assert( mockOnAdd.callCount == 0, `onAdd was called ${mockOnAdd.callCount} times, expected 0` );
		console.assert( mockOnRemove.callCount == 1, `onRemove was called ${mockOnRemove.callCount} times, expected 1` );
		//...onRemove called once with the item we removed
		console.assert( mockOnRemove.calledOnceWithExactly( itemToRemove ), `Expected onRemove to be called once with the item removed, received ${mockOnRemove.args}` );
	});

	
});