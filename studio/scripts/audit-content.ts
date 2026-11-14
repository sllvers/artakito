import {getCliClient} from 'sanity/cli';
const client = getCliClient({apiVersion: '2025-02-19'}).withConfig({useCdn: false});
console.log(JSON.stringify(await client.fetch('*[_type == "artwork"] | order(catalog.current){_id,_rev,title,medium,size,alt,featured,"catalog":catalog.current,"image":image.asset->url}'), null, 2));

const hooks = await client.request<any[]>({uri: "/hooks/projects/mwymllh6", method: "GET"});
console.log("Webhook status", JSON.stringify(hooks.map(({name,isDisabled,isDisabledByUser}) => ({name,isDisabled,isDisabledByUser}))));
