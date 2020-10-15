import React,{Component} from 'react'
import './app.scss';
import Flex from '../src/Flex'
export default class App extends Component{
    render(){
        return <div className="App">
            <Flex className='parent'
                  is='div'
                  style={{
                      flexWrap: 'nowrap',
                      alignContent: 'stretch',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row'
                  }}
            >
                <Flex className='child child1' style={{flexShrink:1,
                    flexGrow:1
                }}>
                    1
                </Flex>
                <Flex className='child child2' style={{flexShrink:2,
                    flexGrow:1
                }}>2</Flex>
                <Flex className='child3' style={{ flexGrow:1}}>我来自中国，123</Flex>
                <Flex className='child child4' style={{flexShrink:4, flexGrow:1}}>4</Flex>
                <Flex className='child child5' style={{
                    flexGrow:10000
                }}>5</Flex>
            </Flex>
            <div className='parent'
                 style={{
                     display:'flex',
                     flexWrap: 'nowrap',
                     alignContent: 'stretch',
                     justifyContent: 'center',
                     alignItems: 'center',
                     flexDirection: 'row'
                 }}
            >
                <div className='child child1' style={{flexShrink:1,
                    flexGrow:1
                }}>
                    1
                </div>
                <div className='child child2' style={{flexShrink:2,
                    flexGrow:1
                }}>2</div>
                <div className='child3'  style={{ flexGrow:1}}>我来自中国，123</div>
                <div className='child child4' style={{flexShrink:4,flexGrow:1}}>4</div>
                <div className='child child5' style={{
                    flexGrow:10000
                }}>5</div>
            </div>
        </div>
    }
}
