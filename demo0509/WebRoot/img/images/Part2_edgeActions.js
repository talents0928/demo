/***********************
* Adobe Edge Animate 组件动作
*
* 小心编辑这个文件，小心保存
* 函数签名和注释以“Edge”起始来维持
* 通过 Adobe Edge Animate 使动作可以交互
*
***********************/
(function($, Edge, compId){
var Composition = Edge.Composition, Symbol = Edge.Symbol; // 常用的 Edge 类别名

   //Edge symbol: 'stage'
   (function(symbolName) {
      
      
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 10200, function(sym, e) {
         

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 10081, function(sym, e) {
         // 在此处插入代码
      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 10333, function(sym, e) {
         // 在此处插入代码
         // 从标签或特定时间开始播放时间轴。例如：
         // sym.play(500); 或 sym.play("myLabel");
         sym.play(0);

      });
      //Edge binding end

   })("stage");
   //Edge symbol end:'stage'

})(window.jQuery || AdobeEdge.$, AdobeEdge, "EDGE-9199730");