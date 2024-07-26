type HomeConstT = {
  benefitsData:string[];
  videoSource:string
  footerItems:{label:string;href:string}[]
}

const HomeConst:HomeConstT  = {
  benefitsData : ['Perfect for researchers', 'Integrates with Excel', 'Start in minutes.'],
  footerItems:[
    {
      label:'Contact us', href:'/contactUs',
    },
    {
      label:'Terms', href:'/terms',
    },
    {
      label:'Privacy', href:'/privacy',
    } 
  ],
  videoSource : 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
}

export {HomeConst}