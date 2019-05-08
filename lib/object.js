import _ from 'lodash';
import assert from 'assert';
import util from 'util';

//pass an array of class names, this will filter out null values and turn into a single string
export function KeysMapper( keys ) {
	_.each( keys, mapper => console.assert( mapper instanceof ValueMapper ) )
	this.keys = keys;
}

KeysMapper.prototype.update = function( item ){
	
	item = item || {};

	_.each( this.keys, ( mapper, id ) => {
		mapper.update( item[id] );
	} );
}


//pass an array of class names, this will filter out null values and turn into a single string
export function ValueMapper({onAdd,onRemove,onUpdate,isMatch} = {}) {
	//onAdd and onRemove are required
	console.assert( _.isFunction( onAdd ), 'onAdd not implemented' ); 
	console.assert( _.isFunction( onRemove ), 'onRemove not implemented' ); 
	
	this.onAdd = onAdd;
	this.onRemove = onRemove;

	//onUpdate and isMatch are optional
	this.onUpdate = _.isFunction( onUpdate ) ? onUpdate : () => {};
	this.isMatch = _.isFunction( isMatch ) ? isMatch : ( itemA, itemB ) => itemA == itemB;

	//this.isInstance = _.isFunction( onUpdate ) ? onUpdate : () => console.warn('onUpdate not implemented') 
	this.value = null;
}

ValueMapper.prototype.update = function( value ){

	if( value !== this.value ){
		if( util.isNullOrUndefined( this.value ) ){
			if( !util.isNullOrUndefined( value ) ){
				this.onAdd( value );
			}
		}else{
			if( util.isNullOrUndefined( value ) ){
				this.onRemove( value );
			}else{
				this.onUpdate( value );
			}
		}
	}

	this.value = value;
}