// bg 为 three 粒子特效
export const setParticles = (particles: any /*THREE.Points*/) => ({
    type: 'SET_PARTICLES',
    payload: particles
})
