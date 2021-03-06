import React from 'react';
import store from './treeStore';
import configs from './styleConfigs';
import { Transition } from 'react-transition-group';
import Folder from './icons/folder';
import FolderOpen from './icons/folderOpen';
import Doc from './icons/doc';
import Pic from './icons/picture';
import ImgDoc from './icons/imgDoc';


export default class Entry extends React.Component {
    constructor(props){
        super(props);

        const { idxs } = props;
        this.entry = store.getState();
        for (let i=0; i<props.idxs.length; i++){
            this.entry = this.entry.children[idxs[i]]
        }

        this.state = {
           ...this.entry
        }

        this.renderChild = this.renderChild.bind(this);
        const keys = ['expanded', 'rootHeight'];
        if (!configs.DISABLE_ANIMATION) keys.push('visibleRows');
        
        store.registerNode(this.setState.bind(this), props.idxs, keys);
    }

    componentWillUnmount(){
        store.unregisterNode(this.props.idxs);
    }

    renderSelf(){
        const padding = configs.LEFT_MARGIN + (this.props.idxs.length-1) * configs.INDENT;
        
        return (
            <div 
                className={`entry ${this.state.rootHeight%2 ? 'even' : 'odd'}`}
                style={{paddingLeft: padding, height: configs.ROW_HEIGHT }}
            />
        )
    }

    renderChild(_, i){
        const idxs = this.props.idxs.slice();
        idxs.push(i);
        return <Entry key={i} idxs={idxs}/>
    }

    render(){  
        //TODO you can try only enabling the transition for the parent expander for better performance.
        
        return (
            <div 
                className="dir-contents" 
                style={ configs.DISABLE_ANIMATION ? {} : {
                    height: configs.ROW_HEIGHT*this.state.visibleRows,
                    transitionDuration: `${configs.ANIMATION_DURATION}ms`
                }}
            >
                { this.renderSelf() }
                { !this.entry.item.isFile && (
                    <Transition 
                        in={this.state.expanded} 
                        timeout={!configs.DISABLE_ANIMATION && configs.ANIMATION_DURATION} 
                        mountOnEnter 
                        unmountOnExit
                    >
                        <>
                            { this.entry.children.map(this.renderChild) }
                        </>
                    </Transition>
                )}
            </div>
        )
    }
}