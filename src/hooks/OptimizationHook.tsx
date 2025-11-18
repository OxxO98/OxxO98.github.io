import { useRef, useCallback, useEffect } from 'react';

function useDebounce(){
  const timer = useRef<number>(0);

  return useCallback<(callback : any, delay : number) => (...arg : any) => void>(
    ( callback : any, delay : number ) => (...arg : any) => {
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        callback(...arg);
      }, delay);
    }, []
  );
}

function useDebounceEffect(func : any, delay : number, deps : any[]) {
  const callback = useCallback(func, deps);

  useEffect( () => {
    const timer = setTimeout( () => {
      callback();
    }, delay);

    return () => {
      clearTimeout(timer);
    }
  }, [callback, delay])
}
  
function useThrottle(){
  let isThrottle = useRef<boolean>(false);

  return useCallback<(callback : any, delay : number) => (...arg : any) => void>(
    ( callback : any, delay : number ) => (...arg : any) => {
      if(isThrottle.current){
        return;
      }

      isThrottle.current = true;

      window.setTimeout( () => {
        callback(...arg);
        isThrottle.current = false;
      }, delay)
    }, []
  )
}

export { useDebounce, useDebounceEffect, useThrottle }