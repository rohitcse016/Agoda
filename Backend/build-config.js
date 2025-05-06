const fs = require("fs");
const path = require("path");

const webConfigContent = `
<configuration>
<system.webServer>
<handlers>
  <add name="iisnode" path="index.js" verb="*" modules="iisnode" />
</handlers>
<rewrite>
  <rules>
    <rule name="nodejs">
      <match url="(.*)" />
      <conditions>
        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
      </conditions>
      <action type="Rewrite" url="index.js" />
    </rule>
  </rules>
</rewrite> 
<security>
  <requestFiltering>
    <hiddenSegments>
      <add segment="node_modules" />
      <add segment="iisnode" />
    </hiddenSegments>
  </requestFiltering>
</security>
</system.webServer>
 </configuration>
`;

const outputPath = path.join(__dirname, "dist", "web.config");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, webConfigContent, "utf8");

console.log("web.config generated successfully!");
