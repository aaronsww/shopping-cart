import React from "react";

function CartProduct({ item, onRemove, onAdd }) {
  return (
    <div className="flex justify-between items-center gap-4 px-5 py-4 border-b border-slate-100 last:border-b-0 bg-white">
      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-700 truncate">{item.title}</p>
        <p className="font-bold mt-1">${item.price}</p>
      </div>
      <div className="flex items-center shrink-0">
        <button
          className="bg-slate-200 hover:bg-slate-300 font-bold text-lg flex justify-center items-center w-7 h-7 rounded"
          onClick={onRemove}
        >
          -
        </button>
        <span className="mx-3 font-bold w-4 text-center">{item.quantity}</span>
        <button
          className="bg-slate-200 hover:bg-slate-300 font-bold text-lg flex justify-center items-center w-7 h-7 rounded"
          onClick={onAdd}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default CartProduct;
