//required modules
const util = require('util');
const _ = require('lodash');
const assert = require('assert');
const sinon = require('sinon');

//the library we're testing
const {KeysMapper,ValueMapper} = require('../../');

describe('ValueMapper', function(){
	
	it('Should provide ValueMapper',() => {
		assert( util.isFunction( ValueMapper ), 'Expected ValueMapper function' )
	});

	it('Should handle onAdd', () => {
		//create a new set of mock functions
		const mockOnAdd = sinon.spy();
		const mockOnRemove = sinon.spy();
		
		let mapper = new ValueMapper({
			onAdd : mockOnAdd,
			onRemove : mockOnRemove
		});

		const value = 1;
		//call mapper the first time with full array
		mapper.update( value );
		//initial update result
		//...onAdd called 2 times, onRemove called 0 times
		console.assert( mockOnAdd.callCount == 1, `onAdd was called ${mockOnAdd.callCount} times, expected 1` );
		console.assert( mockOnRemove.callCount == 0, `onRemove was called ${mockOnRemove.callCount} times, expected 0` );
		//...onAdd called 1 time with each of the items in the array
		const mockCall = mockOnAdd.getCall( 0 );
		console.assert( !util.isNullOrUndefined( mockCall ), `Expected call at index '0'` );
		console.assert( mockCall.calledWith( value ), `Expected called with '${value}', received ${mockCall.args}` );
	});

	it('Should ignore repeated calls with null or undefined', () => {
		//create a new set of mock functions
		const mockOnAdd = sinon.spy();
		const mockOnRemove = sinon.spy();
		
		let mapper = new ValueMapper({
			onAdd : mockOnAdd,
			onRemove : mockOnRemove
		});

		const value = 1;
		_.each([null,undefined,undefined,null,null], value => {
			// 	//reset spies
			mockOnAdd.resetHistory();
			mockOnRemove.resetHistory();
			//call update
			mapper.update( value );
			//check call counts
			console.assert( mockOnAdd.callCount == 0, `onAdd was called ${mockOnAdd.callCount} times, expected 0` );
			console.assert( mockOnRemove.callCount == 0, `onRemove was called ${mockOnRemove.callCount} times, expected 0` );
		});
	});

	it('Should ignore repeated calls with the same value', () => {
		//create a new set of mock functions
		const mockOnAdd = sinon.spy();
		const mockOnUpdate = sinon.spy();
		const mockOnRemove = sinon.spy();
		
		let mapper = new ValueMapper({
			onAdd : mockOnAdd,
			onUpdate : mockOnUpdate,
			onRemove : mockOnRemove
		});

		const value = 1;
		mapper.update( value );
		//check the call count
		console.assert( mockOnAdd.callCount == 1, `onAdd was called ${mockOnAdd.callCount} times, expected 1` );
		console.assert( mockOnUpdate.callCount == 0, `onUpdate was called ${mockOnUpdate.callCount} times, expected 0` );
		console.assert( mockOnRemove.callCount == 0, `onRemove was called ${mockOnRemove.callCount} times, expected 0` );
		// 	//reset spies
		mockOnAdd.resetHistory();
		mockOnUpdate.resetHistory();
		mockOnRemove.resetHistory();
		//call update again with the same value
		mapper.update( value );
		console.assert( mockOnAdd.callCount == 0, `onAdd was called ${mockOnAdd.callCount} times, expected 0` );
		console.assert( mockOnUpdate.callCount == 0, `onUpdate was called ${mockOnUpdate.callCount} times, expected 0` );
		console.assert( mockOnRemove.callCount == 0, `onRemove was called ${mockOnRemove.callCount} times, expected 0` );
	});

	it('Should call onUpdate with new value', () => {
		//create a new set of mock functions
		const mockOnAdd = sinon.spy();
		const mockOnUpdate = sinon.spy();
		const mockOnRemove = sinon.spy();
		
		let mapper = new ValueMapper({
			onAdd : mockOnAdd,
			onUpdate : mockOnUpdate,
			onRemove : mockOnRemove
		});

		const value = 1;
		mapper.update( value );
		//check the call count
		console.assert( mockOnAdd.callCount == 1, `onAdd was called ${mockOnAdd.callCount} times, expected 1` );
		console.assert( mockOnUpdate.callCount == 0, `onUpdate was called ${mockOnUpdate.callCount} times, expected 0` );
		console.assert( mockOnRemove.callCount == 0, `onRemove was called ${mockOnRemove.callCount} times, expected 0` );
		// 	//reset spies
		mockOnAdd.resetHistory();
		mockOnUpdate.resetHistory();
		mockOnRemove.resetHistory();
		//call update again with the same value
		mapper.update( 2 );
		console.assert( mockOnAdd.callCount == 0, `onAdd was called ${mockOnAdd.callCount} times, expected 0` );
		console.assert( mockOnUpdate.callCount == 1, `onUpdate was called ${mockOnUpdate.callCount} times, expected 1` );
		console.assert( mockOnRemove.callCount == 0, `onRemove was called ${mockOnRemove.callCount} times, expected 0` );
	});

	it('Should call onUpdate with new falsy statement', () => {
		//create a new set of mock functions
		const mockOnAdd = sinon.spy();
		const mockOnUpdate = sinon.spy();
		const mockOnRemove = sinon.spy();
		
		let mapper = new ValueMapper({
			onAdd : mockOnAdd,
			onUpdate : mockOnUpdate,
			onRemove : mockOnRemove
		});

		const value = 1;
		mapper.update( value );
		//check the call count
		console.assert( mockOnAdd.callCount == 1, `onAdd was called ${mockOnAdd.callCount} times, expected 1` );
		console.assert( mockOnUpdate.callCount == 0, `onUpdate was called ${mockOnUpdate.callCount} times, expected 0` );
		console.assert( mockOnRemove.callCount == 0, `onRemove was called ${mockOnRemove.callCount} times, expected 0` );

		_.each([0,false,"1"], (value) => {
			// 	//reset spies
			mockOnAdd.resetHistory();
			mockOnUpdate.resetHistory();
			mockOnRemove.resetHistory();
			//call update again with the same value
			mapper.update( value );
			console.assert( mockOnAdd.callCount == 0, `onAdd was called ${mockOnAdd.callCount} times, expected 0` );
			console.assert( mockOnUpdate.callCount == 1, `onUpdate was called ${mockOnUpdate.callCount} times, expected 1` );
			console.assert( mockOnRemove.callCount == 0, `onRemove was called ${mockOnRemove.callCount} times, expected 0` );
		})
	});

	
});

describe('KeysMapper', function(){
	
	it('Should provide KeysMapper',() => {
		assert( util.isFunction( KeysMapper ), 'Expected KeysMapper function' )
	});

	it('Should pass through calls to ValueMapper', () => {
		//create a new set of mock functions
		const mockOnAdd = sinon.spy();
		const mockOnUpdate = sinon.spy();
		const mockOnRemove = sinon.spy();

		const resetSpies = () => {
			// 	//reset spies
			mockOnAdd.resetHistory();
			mockOnUpdate.resetHistory();
			mockOnRemove.resetHistory();
		}

		const mapper = new KeysMapper({
			label: new ValueMapper({
				onAdd : mockOnAdd,
				onUpdate : mockOnUpdate,
				onRemove : mockOnRemove
			})
		});

		const item = {
			label: '1'
		};

		//initial call with the start value
		mapper.update( item );
		//check the call counts
		console.assert( mockOnAdd.callCount == 1, `1:onAdd was called ${mockOnAdd.callCount} times, expected 1` );
		console.assert( mockOnUpdate.callCount == 0, `1:onUpdate was called ${mockOnUpdate.callCount} times, expected 0` );
		console.assert( mockOnRemove.callCount == 0, `1:onRemove was called ${mockOnRemove.callCount} times, expected 0` );

		resetSpies();
		//call again should result in no calls to spies
		mapper.update( item );
		//check the call counts
		console.assert( mockOnAdd.callCount == 0, `2:onAdd was called ${mockOnAdd.callCount} times, expected 0` );
		console.assert( mockOnUpdate.callCount == 0, `2:onUpdate was called ${mockOnUpdate.callCount} times, expected 0` );
		console.assert( mockOnRemove.callCount == 0, `2:onRemove was called ${mockOnRemove.callCount} times, expected 0` );
		
		//change the label
		item.label = '2';
		//reset spies
		resetSpies();
		//another call should result in changes to spies
		mapper.update( item );
		//check the call counts
		console.assert( mockOnAdd.callCount == 0, `3:onAdd was called ${mockOnAdd.callCount} times, expected 0` );
		console.assert( mockOnUpdate.callCount == 1, `3:onUpdate was called ${mockOnUpdate.callCount} times, expected 1` );
		console.assert( mockOnRemove.callCount == 0, `3:onRemove was called ${mockOnRemove.callCount} times, expected 0` );
		
		//delete the label
		item.label = null;
		//reset spies
		resetSpies();
		//another call should result in changes to spies
		mapper.update( item );
		//check the call counts
		console.assert( mockOnAdd.callCount == 0, `4:onAdd was called ${mockOnAdd.callCount} times, expected 0` );
		console.assert( mockOnUpdate.callCount == 0, `4:onUpdate was called ${mockOnUpdate.callCount} times, expected 0` );
		console.assert( mockOnRemove.callCount == 1, `4:onRemove was called ${mockOnRemove.callCount} times, expected 1` );
	});

});