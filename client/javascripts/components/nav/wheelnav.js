// (()=>{
  var myWheelnav = new wheelnav("divWheelnav");
        myWheelnav.slicePathFunction = slicePath().DonutSlice;
        myWheelnav.colors = new Array("mediumorchid", "royalblue", "darkorange");
        myWheelnav.createWheel([icon.github, icon.people, icon.smile]);
  // let wheel = new wheelnav("divWheel");
  // wheel.clockwise = false;
  // wheel.clickModeRotate = false;
// })();