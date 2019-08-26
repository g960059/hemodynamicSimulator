export const e = (t, Tmax, tau, HR)=>{
  const t_ = t % (60000/HR)
  if(t_ < Tmax){
    const base = Math.exp(-(60000/HR-3*Tmax/2)/tau)/2
    return (Math.sin(Math.PI * t_/Tmax- Math.PI/2)+1)/2 *(1-base) + base
  }else{
    if(t_ < 3*Tmax/2){
      return (Math.sin(Math.PI * t_/Tmax- Math.PI/2)+1)/2 
    }else{
      return Math.exp(-(t_-3*Tmax/2)/tau)/2
    }
  }
}

// use memo

export const P = (V, t,Ees,V0, alpha, beta,Tmax, tau, AV_delay,HR)=>{
  const Ped = beta * (Math.exp(alpha*(V-V0))-1) 
  const Pes = Ees * (V-V0)
  return Ped + e(t-AV_delay,Tmax,tau,HR)*(Pes-Ped)
}

const pvFunc = (t,[Qvs, Qas, Qap, Qvp, Qlv, Qla, Qrv, Qra, Qas_prox,Qap_prox],
    { Rcs,Rcp,Ras,Rvs,Rap,Rvp,Ras_prox,Rap_prox,Rmv,Rtv,Cas,Cvs,Cap,Cvp,Cas_prox,Cap_prox,
      LV_Ees,LV_V0,LV_alpha,LV_beta,LV_Tmax,LV_tau,LV_AV_delay,
      LA_Ees,LA_V0,LA_alpha,LA_beta,LA_Tmax,LA_tau,LA_AV_delay,
      RV_Ees,RV_V0,RV_alpha,RV_beta,RV_Tmax,RV_tau,RV_AV_delay,
      RA_Ees,RA_V0,RA_alpha,RA_beta,RA_Tmax,RA_tau,RA_AV_delay,HR} ={}
    ,logger =null
    )=>{
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
    if(logger != null){
      logger.push({t,Qvs, Qas, Qap, Qvp, Qlv, Qla, Qrv, Qra, Qas_prox,Qap_prox,Plv, Pla, Prv, Pra,Ias,Ics,Imv,Ivp,Iap,Icp,Itv,Ivs,Iasp,Iapp})
    }
    return [Ias-Ivs, Ics-Ias, Icp-Iap, Iap-Ivp, Imv-Iasp, Ivp-Imv, Itv-Iapp, Ivs-Itv, Iasp-Ics, Iapp-Icp]
}

//0:Qvs, 1:Qas,2:Qap,3:Qvp,4:Qlv,5:Qla,6:Qrv,7:Qra,8:Qas_prox,9:Qap_prox,10:Plv,11:Pla,12:Prv,13:Pra,14:Ias,15:Ics,16:Imv,17:Ivp,18:Iap,19:Icp,20:Itv,21:Ivs,22:Iasp,23:Iapp
//{LV:[4,10],LA:[5,11],RV:[6,12],RA:[7,13]}


export const u_P=(V,T, Ees,V0,alpha, beta, Tmax, tau, AV_delay, HR) =>{
  const len = V.length
  const res = new Array(len)
  for(let i=0;i<len;i++){
    res[i] = P(V[i],T[i], Ees,V0, alpha, beta, Tmax, tau, AV_delay, HR)
  }
  return res
}


export default pvFunc