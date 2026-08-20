const BRAND_EN="Muslim Mirror";
const BRAND_AR="مِرْآةُ الْمُسْلِمِ";

export function installBrandIdentity(){
 document.documentElement.dataset.brandEn=BRAND_EN;
 document.documentElement.dataset.brandAr=BRAND_AR;
 if(!document.title||/Sakinah|سكينة/i.test(document.title))document.title=BRAND_EN;
}

export const MuslimMirrorBrand={en:BRAND_EN,ar:BRAND_AR};
