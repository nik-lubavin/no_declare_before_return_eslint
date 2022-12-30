function f1(arg1, arg2, arg3) {
    // stop updates
    const iterable = data.aStops || [];
    for (let i = 0; i < iterable.length; i += 1) {
        const stop = iterable[i];
      	iterable[i] = stop;
    }

    if (updateMiles.length || updateGoodsMiles.length || updateCarrierMiles.length) {
        return true;
    }

    return false;
}