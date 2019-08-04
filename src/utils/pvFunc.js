const e = (t, Tmax, tau, HR)=>{
  const t_ = t % (60000/HR)
  if(t_ < 3*Tmax/2){
    return (Math.sin(Math.PI * t_/Tmax- Math.PI/2)+1)/2
  }else{
    return Math.exp(-(t_-3*Tmax/2)/tau)/2
  }
}

// use memo

export const P = (V, t,Ees,V0, alpha, beta,Tmax, tau, AV_delay,HR)=>{
  const Ped = beta * (Math.exp(alpha*(V-V0))-1)
  const Pes = Ees * (V-V0)
  return Ped + e(t-AV_delay,Tmax,tau,HR)*(Pes-Ped)
}

// const Rcs = 40
// const Rcp = 30
// const Ras= 820
// const Rvs = 15
// const Rap = 13
// const Rvp = 15
// const Ras_prox = 25
// const Rap_prox = 10

// const Rmv = 2.5
// const Rtv = 2.5

// const Cas = 1.8
// const Cvs = 70
// const Cap = 20
// const Cvp = 7
// const Cas_prox = 0.1
// const Cap_prox = 1.0

// const LV_Ees = 2.21
// const LV_V0 = 5
// const LV_alpha = 0.029
// const LV_beta = 0.34
// const LV_Tmax = 300
// const LV_tau = 25
// const LV_AV_delay = 160

// const LA_Ees = 0.48
// const LA_V0 = 10
// const LA_alpha = 0.058
// const LA_beta = 0.44
// const LA_Tmax = 125
// const LA_tau = 20
// const LA_AV_delay = 0

// const RV_Ees = 0.74
// const RV_V0 = 5
// const RV_alpha = 0.028
// const RV_beta = 0.34
// const RV_Tmax = 300
// const RV_tau = 25
// const RV_AV_delay = 160

// const RA_Ees = 0.38
// const RA_V0 = 10
// const RA_alpha = 0.046
// const RA_beta = 0.44
// const RA_Tmax = 125
// const RA_tau = 20
// const RA_AV_delay = 0

// const HR = 60

const pvFunc = (t,[Qvs, Qas, Qap, Qvp, Qlv, Qla, Qrv, Qra, Qas_prox,Qap_prox],{
    Rcs = 40,
    Rcp = 30,
    Ras= 820,
    Rvs = 15,
    Rap = 13,
    Rvp = 15,
    Ras_prox = 25,
    Rap_prox = 10,
    Rmv = 2.5,
    Rtv = 2.5,
    Cas = 1.8,
    Cvs = 70,
    Cap = 20,
    Cvp = 7,
    Cas_prox = 0.1,
    Cap_prox = 1.0,

    LV_Ees = 2.21,
    LV_V0 = 5,
    LV_alpha = 0.029,
    LV_beta = 0.34,
    LV_Tmax = 300,
    LV_tau = 25,
    LV_AV_delay = 160,

    LA_Ees = 0.48,
    LA_V0 = 10,
    LA_alpha = 0.058,
    LA_beta = 0.44,
    LA_Tmax = 125,
    LA_tau = 20,
    LA_AV_delay = 0,

    RV_Ees = 0.74,
    RV_V0 = 5,
    RV_alpha = 0.028,
    RV_beta = 0.34,
    RV_Tmax = 300,
    RV_tau = 25,
    RV_AV_delay = 160,

    RA_Ees = 0.38,
    RA_V0 = 10,
    RA_alpha = 0.046,
    RA_beta = 0.44,
    RA_Tmax = 125,
    RA_tau = 20,
    RA_AV_delay = 0,
    
    HR = 60} ={}
    )=>{
    // const [Qvs, Qas, Qap, Qvp, Qlv, Qla, Qrv, Qra, Qas_prox,Qap_prox] = x
    const Plv = P(Qlv,t, LV_Ees, LV_V0, LV_alpha, LV_beta, LV_Tmax, LV_tau, LV_AV_delay, HR)
    const Pla = P(Qla,t, LA_Ees, LA_V0, LA_alpha, LA_beta, LA_Tmax, LA_tau, LA_AV_delay, HR)
    const Prv = P(Qrv,t, RV_Ees, RV_V0, RV_alpha, RV_beta, RV_Tmax, RV_tau, RV_AV_delay, HR)
    const Pra = P(Qra,t, RA_Ees, RA_V0, RA_alpha, RA_beta, RA_Tmax, RA_tau, RA_AV_delay, HR)
    let Ias = (Qas/Cas-Qvs/Cvs)/Ras
    let Ics = (Qas_prox/Cas_prox-Qas/Cas)/Rcs  
    let Imv = (Pla-Plv)/Rmv
    let Ivp = (Qvp/Cvp-Pla)/Rvp
    let Iap = (Qap/Cap-Qvp/Cvp)/Rap
    let Icp = (Qap_prox/Cap_prox-Qap/Cap)/Rcp
    let Itv = (Pra-Prv)/Rtv
    let Ivs = (Qvs/Cvs-Pra)/Rvs
    let Iasp =(Plv-Qas_prox/Cas_prox)/Ras_prox
    let Iapp =(Prv-Qap_prox/Cap_prox)/Rap_prox
    
    if(Iasp < 0){
      Iasp = 0
    }
    if(Iapp < 0){
      Iapp = 0
    }  
    if(Imv < 0){
      Imv = 0
    }
    if(Itv < 0){
      Itv = 0
    }
        
    return [Ias-Ivs, Ics-Ias, Icp-Iap, Iap-Ivp, Imv-Iasp, Ivp-Imv, Itv-Iapp, Ivs-Itv, Iasp-Ics, Iapp-Icp]
}


export const u_P=(V,T, Ees,V0,alpha, beta, Tmax, tau, AV_delay, HR) =>{
  const len = V.length
  const res = new Array(len)
  for(let i=0;i<len;i++){
    res[i] = P(V[i],T[i], Ees,V0, alpha, beta, Tmax, tau, AV_delay, HR)
  }
  return res
}


export default pvFunc