export const setState = (component: any, state: any) => {
    return new Promise((resolve) => {
      component.setState(state, resolve);
    });
}