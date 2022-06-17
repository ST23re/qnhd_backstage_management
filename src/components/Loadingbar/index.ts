import {createVNode, render} from 'vue'
import Loadingbar from '@/components/Loadingbar/Loadingbar.vue'
const Vnode = createVNode(Loadingbar);
render(Vnode, document.body);

export default Vnode;