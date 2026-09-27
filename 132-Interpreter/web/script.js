class Expression{interpret(context){throw new Error("Not implemented");}}
class RoleExpression extends Expression{constructor(role){super();this.role=role.toUpperCase()}interpret(context){return context.roles.has(this.role)}}
class AndExpression extends Expression{constructor(left,right){super();this.left=left;this.right=right}interpret(context){return this.left.interpret(context)&&this.right.interpret(context)}}
class OrExpression extends Expression{constructor(left,right){super();this.left=left;this.right=right}interpret(context){return this.left.interpret(context)||this.right.interpret(context)}}

class Parser{
constructor(input){this.tokens=input.match(/[A-Za-z_][A-Za-z0-9_]*|\(|\)/g)||[];this.position=0}
peek(){return this.tokens[this.position]}
consume(){return this.tokens[this.position++]}
parse(){if(!this.tokens.length)throw new Error("Please enter an access rule.");const e=this.parseOr();if(this.position!==this.tokens.length)throw new Error("Unexpected token: "+this.peek());return e}
parseOr(){let left=this.parseAnd();while((this.peek()||"").toUpperCase()==="OR"){this.consume();left=new OrExpression(left,this.parseAnd())}return left}
parseAnd(){let left=this.parsePrimary();while((this.peek()||"").toUpperCase()==="AND"){this.consume();left=new AndExpression(left,this.parsePrimary())}return left}
parsePrimary(){const t=this.peek();if(t==="("){this.consume();const e=this.parseOr();if(this.consume()!==")")throw new Error("Missing closing parenthesis.");return e}if(!t||t===")"||["AND","OR"].includes(t.toUpperCase()))throw new Error("Expected a role name.");this.consume();return new RoleExpression(t)}
}

function trace(e,c,d=0){const p="  ".repeat(d);if(e instanceof RoleExpression)return `${p}${e.role} -> ${e.interpret(c)?"TRUE":"FALSE"}`;const op=e instanceof AndExpression?"AND":"OR";return `${p}${op}\n${trace(e.left,c,d+1)}\n${trace(e.right,c,d+1)}\n${p}=> ${e.interpret(c)?"TRUE":"FALSE"}`}
function evaluate(){
const rule=document.getElementById("ruleInput").value.trim(),roles=new Set([...document.querySelectorAll(".roles input:checked")].map(x=>x.value));
try{const e=new Parser(rule).parse(),c={roles},r=e.interpret(c),card=document.getElementById("resultCard");
card.classList.remove("hidden");card.classList.toggle("denied",!r);
document.getElementById("resultIcon").textContent=r?"✓":"×";document.getElementById("resultTitle").textContent=r?"ACCESS GRANTED":"ACCESS DENIED";
document.getElementById("resultMessage").textContent=r?`The rule "${rule}" is satisfied.`:`The rule "${rule}" is not satisfied.`;
document.getElementById("trace").textContent=`Roles: ${[...roles].join(", ")||"NONE"}\nRule: ${rule}\n\n${trace(e,c)}`}
catch(err){const card=document.getElementById("resultCard");card.classList.remove("hidden");card.classList.add("denied");document.getElementById("resultIcon").textContent="!";document.getElementById("resultTitle").textContent="INVALID RULE";document.getElementById("resultMessage").textContent=err.message;document.getElementById("trace").textContent=err.message}}
document.getElementById("evaluateBtn").addEventListener("click",evaluate);
document.querySelectorAll(".examples button").forEach(b=>b.addEventListener("click",()=>document.getElementById("ruleInput").value=b.dataset.rule));
