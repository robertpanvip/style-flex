import React from "react";
import {getMaxContent, getMinContent, objectToStyleText} from "./dom";

const JUSTIFY_CONTENT = {
    FLEX_START: 'flex-start',
    FLEX_END: 'flex-end',
    CENTER: 'center',
    SPACE_BETWEEN: 'space-between',
    SPACE_AROUND: 'space-around'
};

const ALIGN_ITEMS = {
    FLEX_START: 'flex-start',
    FLEX_END: 'flex-end',
    CENTER: 'center',
    BASELINE: 'baseline',
    STRETCH: 'stretch'
};
//决定主轴的方向（即项目的排列方向）
const FLEX_DIRECTION = {
    ROW: 'row',//主轴为水平方向，起点在左端
    ROW_REVERSE: 'row-reverse', //主轴为水平方向，起点在右端
    COLUMN: 'column',//主轴为垂直方向，起点在上沿
    COLUMN_REVERSE: 'column-reverse'//主轴为垂直方向，起点在下沿
};
//如果一条轴线排不下，如何换行
const FLEX_WRAP = {
    NOWRAP: 'nowrap',//不换行
    WRAP: 'wrap',//换行，第一行在上方
    WRAP_REVERSE: 'wrap-reverse'//换行，第一行在下方
};
//定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用
const ALIGN_CONTENT = {
    FLEX_START: 'flex-start',//与交叉轴的起点对齐
    FLEX_END: 'flex-end',//与交叉轴的终点对齐
    CENTER: 'center',//与交叉轴的中点对齐
    SPACE_BETWEEN: 'space-between',//与交叉轴两端对齐，轴线之间的间隔平均分布
    SPACE_AROUND: 'space-around',//每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
    STRETCH: 'stretch',//轴线占满整个交叉轴
};
const FLEX_SHRINK = 1;//定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小
const FLEX_GROW = 0;//定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大
export default class Flex extends React.Component {
    static defaultProps = {
        is: 'div',
        inline: false,
    };
    static defaultStyle = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap', //默认不换行
        flexFlow: `row nowrap`,
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        alignContent: 'stretch',
        justifyContent: 'flex-start', //默认左对齐
        order: 0,//属性定义项目的排列顺序。数值越小，排列越靠前，默认为0
        flexGrow: 0,//属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大
        flexShrink: 1 //属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小
    };
    state = {
        style: {
            left: 0,
            top: 0
        },
        minMaxIndexArray: [],
        childrenRect: []
    };

    componentDidMount() {
        const start = new Date().getTime();
        this.getUndefinedBox();

        this.init();

        this.flowLayout();
        console.log('new Date2', new Date().getTime() - start)
    }
    getSnapshotBeforeUpdate(prevProps, prevState) {

        const clientRect = this.ref.getBoundingClientRect();
        return {
            width:clientRect.width,
            height:clientRect.height,
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const clientRect = this.ref.getBoundingClientRect();
        if(snapshot.width!==clientRect.width||snapshot.height!==clientRect.height){
            //this.getUndefinedBox();
           // this.init();
            //this.flowLayout();
        }

    }

    getUndefinedBox() {
        const {inline}=this.props;
        const style = getComputedStyle(this.ref)
        const oriStyle = this.ref.getAttribute('style')
        this.ref.style.display = 'none'
        if (parseFloat(style.height) === 0) {
            if (style.height === 'auto') {
                this.heightIsUndefined = true;
            }
        }

        if (inline&&style.width === 'auto') {
            this.ref.style.display='inline-block';
            this.ref.style.position='relative';
            const oriChildStyle={};
            const childArrNode= Array.from(this.ref.childNodes)
            childArrNode.forEach((item,index)=>{
               oriChildStyle[index]=item.getAttribute('style')
               item.style.position='relative';
               item.style.display='inline-block';
           })
            this.widthIsUndefined = true;
            this.width=this.ref.getBoundingClientRect().width;
            const {style:oldStyle}=this.state
            this.setState({
                style:{
                    ...oldStyle,
                    width:this.width
                }
            });
            childArrNode.forEach((item,index)=>{
                item.style=oriChildStyle[index];
            });
            console.log(this.width)
        }

        this.ref.setAttribute('style',oriStyle);
        if (!this.parent()) {
            Array.from(this.ref.childNodes).forEach((item, index) => {
                item.setAttribute('data-min-width', getMinContent(item))
                item.setAttribute('data-max-width', getMaxContent(item))
            })
        }
    }

    init() {
        const {style = {}} = this.props;
        const {
            flexWrap = Flex.defaultStyle.flexWrap,
            flexDirection = Flex.defaultStyle.flexDirection
        } = style;
        const clientRect = this.ref.getBoundingClientRect();
        const width = clientRect.width;
        const height = clientRect.height;
        if(!this.widthIsUndefined){
            this.width = width;
        }
        this.height = height;
        const computedStyle = getComputedStyle(this.ref);
        const borderPadding = this.getBorderPadding(computedStyle)
        if (computedStyle.boxSizing === 'border-box') {
            borderPadding.width = 0;
            borderPadding.height = 0;
        }
        this.mainSize = {
            width: this.width - borderPadding.width,
            height: height - borderPadding.height,
        }

        let W = 'width';
        let H = 'height';
        let L = 'left';
        let T = 'top';
        let FLEX_START = 'FLEX_START';
        let FLEX_END = 'FLEX_END';
        if (flexDirection.includes(FLEX_DIRECTION.COLUMN)) {
            W = 'height';
            H = 'width';
            L = 'top';
            T = 'left'
        }
        if (flexWrap === FLEX_WRAP.WRAP_REVERSE) {
            FLEX_START = 'FLEX_END';
            FLEX_END = 'FLEX_START'
        }

        this.W = W;
        this.H = H;
        this.L = L;
        this.T = T;
        this.FLEX_START = FLEX_START;
        this.FLEX_END = FLEX_END;
    }

    /**
     * 创建布局
     */
    flowLayout() {
        const {style = {}} = this.props;
        const {
            flexWrap = Flex.defaultStyle.flexWrap,
        } = style;
        const {childrenRect} = this.state;

        const {W, L, T, H} = this;
        this.layout = [];
        if (flexWrap === FLEX_WRAP.NOWRAP) {
            this.layout.push(childrenRect)
        } else {
            let sliceIndex = 0;
            let line = 1;
            childrenRect.reduce((al, item, it) => {
                let res = al + item[W];
                if (it !== 0) {
                    if (al && (al + item[W]) > (this.mainSize[W]) * line) {
                        res = this.mainSize[W] * line + item[W];
                        this.layout.push(childrenRect.slice(sliceIndex, it))
                        sliceIndex = it;
                        line = line + 1;
                    }
                    if (it === childrenRect.length - 1) {
                        this.layout.push(childrenRect.slice(sliceIndex, it + 1))
                    }
                }
                return res
            }, 0);
        }

        this.setLineFlexShrink();

        this.layout = this.layout.map((line, it) => {
            const pre = this.layout[it]
            /**得到一行的最大值**/
            const lineMax = Math.max(...pre.map(p => p[H]));
            /**得到前面几行**/
            const preLine = this.layout.filter((a, b) => b < it);
            /**设置每一行的最大值**/
            line = line.map((box) => {
                box.lineMax = lineMax;
                return box;
            });
            /**得到前面几行的总高度**/
            const _pre = preLine.reduce((al, item) => al + item[0].lineMax, 0);
            /**设置每一个box的top值**/
            line = line.map((box) => {
                box[T] = _pre;
                return box;
            });

            line = line.map((box, index) => {
                box[L] = line.filter((a, b) => b < index).reduce((al, item) => al + item[W], 0);
                return box;
            });
            return line;
        });
        if (this.heightIsUndefined) {
            this.height = this.layout.reduce((all, a) => all + a[0].lineMax, 0);
        }
        this.setLines();
        this.setLinesBox();

        this.layout.forEach((line) => {
            line.forEach((box) => {
                const style = getComputedStyle(box.node);
                const borderPadding = this.getBorderPadding(style)
                if (style.boxSizing === 'border-box') {
                    borderPadding.width = 0;
                    borderPadding.height = 0;
                }
                const borderWidth = borderPadding[W];
                box[W] = box[W] - borderWidth;
                box[H]=box[H] -  borderPadding[H];
                box.ref.updateStyle({
                    [W]: box[W],
                    [H]: box[H],
                    [T]: box[T],
                    [L]: box[L],
                });
                return box;
            });
        });
        if (this.parent()) {
            /**alignSelf 继承父类的alignItems**/
            const parentStyle = this.parent().props.style || {};
            const {alignItems = Flex.defaultStyle.alignItems} = parentStyle;
            const {
                alignSelf = alignItems,
                flexShrink = Flex.defaultStyle.flexShrink,
                flexGrow = Flex.defaultStyle.flexGrow
            } = style;
            this.parent().addChildRect({
                ref: this,
                node: this.ref,
                alignSelf,
                flexShrink,
                flexGrow,
                width:this.width,
                height:this.height
            });
        }
    }

    setLineFlexShrink() {
        const {W} = this;
        this.layout = this.layout.map(itemLine => {
            /**得到前面几行的总高度**/
            const allWidth = itemLine.reduce((al, item) => al + item[W], 0);
            const totalFlexGrow = itemLine.reduce((al, item) => al + item.flexGrow, 0);
            const totalFlexShrink = itemLine.reduce((al, item) => al + item.flexShrink, 0);
            /**容器宽度扣除flex-basis之后的剩余空间**/
            const freeSpace = this.mainSize[W] - allWidth;

            if (allWidth > this.mainSize[W]) {

                itemLine = itemLine.map(item => {
                    const style = getComputedStyle(item.node);
                    const borderPadding = this.getBorderPadding(style);
                    if (style.boxSizing === 'border-box') {
                        borderPadding.width = 0;
                        borderPadding.height = 0;
                    }
                    item.borderPadding = borderPadding;
                    item.flexBasis = item[W] - borderPadding[W];
                    return item;
                })


                itemLine = itemLine.map((item, index) => {

                    const basicShrink = itemLine.reduce((al, a) => al + a.flexBasis * a.flexShrink, 0)
                    /**元素伸展量**/
                    const shrinkSize = freeSpace * (item.flexBasis * item.flexShrink / basicShrink)
                    //const shrinkSize = freeSpace * (item.flexShrink / totalFlexShrink)
                    item[W] = item[W] + shrinkSize;
                    item.minWidth = parseFloat(item.node.getAttribute('data-min-width'));
                    return item;
                });
                const resets = [];
                let restFlexShrink = totalFlexShrink;
                const loop = () => {
                    for (let i = 0; i < itemLine.length; i++) {
                        const item = itemLine[i];
                        if (item[W] < item.minWidth) {
                            const ori = item[W];
                            resets.push(i)
                            itemLine[i][W] = item.minWidth;
                            let allCanNotShrinkSize = Math.abs(item[W] - ori);
                            let allCanNotShrink = item.flexShrink;
                            restFlexShrink = restFlexShrink - allCanNotShrink;
                            itemLine.forEach((it, ind) => {
                                if (!resets.includes(ind)) {
                                    itemLine[ind][W] = itemLine[ind][W] - allCanNotShrinkSize / (restFlexShrink) * itemLine[ind].flexShrink;
                                }
                            });
                            loop()
                        }
                    }
                }
                loop();

            } else {
                itemLine = itemLine.map(item => {
                    if (totalFlexGrow !== 0) {
                        /**元素伸展量**/
                        const growSize = freeSpace * (item.flexGrow / totalFlexGrow)
                        item[W] = item[W] + growSize;
                    }
                    return item;
                });
            }
            return itemLine;
        })
    }

    getBorderPadding(style) {
        return {
            width: parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth) + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
            height: parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth) + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
        };
    }

    /**
     * 定义多根轴线的对齐方式
     */
    setLines() {
        const {
            style = {},
        } = this.props;
        const {W, L, H, T, FLEX_START, FLEX_END} = this;
        let {
            alignContent = Flex.defaultStyle.alignContent,
            flexWrap = Flex.defaultStyle.flexWrap,
        } = style;
        /**alignContent属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用**/
        if (flexWrap === FLEX_WRAP.NOWRAP) {
            alignContent = ALIGN_CONTENT.STRETCH
        }
        /**每一行的最大值加起来**/
        const allHeight = this.layout.reduce((al, item) => al + (item[0] ? item[0].lineMax : 0), 0);
        const stretchDefaultDeal = () => {
            this.layout = this.layout.map((line, index) => {
                const restHeight = this[H] - allHeight;
                const marginTop = restHeight / this.layout.length;
                /**得到前面的总的行高度**/
                const marginZero = marginTop * index;
                line = line.map(box => {
                    box[T] = box[T] + marginZero;
                    box.axisHeight = box.lineMax + marginTop;
                    return box;
                });
                return line
            })
        };
        //定义多根轴线的对齐方式
        switch (alignContent) {
            case ALIGN_CONTENT.STRETCH:
                stretchDefaultDeal();
                break;
            case ALIGN_CONTENT[FLEX_START]:
                this.layout = this.layout.map((item) => {
                    item = item.map(box => {
                        box.axisHeight = box.lineMax;
                        return box;
                    });
                    return item;
                });
                break;
            case ALIGN_CONTENT[FLEX_END]:
                this.layout = this.layout.map((item) => {
                    item = item.map(box => {
                        box[T] = box[T] + this[H] - allHeight;
                        box.axisHeight = box.lineMax;
                        return box;
                    });
                    return item;
                });

                break;
            case ALIGN_CONTENT.CENTER:
                this.layout = this.layout.map((item) => {
                    item = item.map(box => {
                        box[T] = box[T] + (this[H] - allHeight) / 2
                        box.axisHeight = box.lineMax;
                        return box;
                    });
                    return item;
                });
                break;
            case ALIGN_CONTENT.SPACE_AROUND:
                const gap = (this[H] - allHeight) / (this.layout.length * 2);
                this.layout = this.layout.map((item, index) => {
                    item = item.map(box => {
                        box[T] = box[T] + (index * 2 + 1) * gap;
                        box.axisHeight = box.lineMax;
                        return box;
                    });
                    return item;
                });
                break;
            case ALIGN_CONTENT.SPACE_BETWEEN:
                this.layout = this.layout.map((item, index) => {
                    if (index === 0) {
                        item[T] += 0;
                    } else if (index === this.layout.length - 1) {
                        item = item.map(box => {
                            box[T] = box[T] + this[H] - allHeight;
                            box.axisHeight = box.lineMax;
                            return box;
                        });
                    } else {
                        const gapWidth = (this[H] - allHeight) / (this.layout.length - 1);
                        item = item.map(box => {
                            box[T] = box[T] + gapWidth * index;
                            box.axisHeight = box.lineMax;
                            return box;
                        });
                    }

                    return item;
                });
                break;
            default:
                stretchDefaultDeal();
                break;

        }
    }

    setLinesBox() {
        const {
            style = {},
        } = this.props;
        const {W, L, H, T, FLEX_START, FLEX_END} = this;
        let {
            justifyContent = Flex.defaultStyle.justifyContent,
            flexDirection = Flex.defaultStyle.flexDirection,
        } = style;

        //主轴居中
        switch (justifyContent) {
            case JUSTIFY_CONTENT.FLEX_START:
                break;
            case JUSTIFY_CONTENT.FLEX_END:
                this.layout = this.layout.map((line) => {
                    /**一行盒子的宽度**/
                    const lineWith = line.reduce((a, b) => a + b[W], 0);
                    line = line.map(box => {
                        box[L] = box[L] + this.mainSize[W] - lineWith;
                        return box;
                    });
                    return line;
                });
                break;
            case JUSTIFY_CONTENT.CENTER:
                this.layout = this.layout.map((line) => {
                    /**一行盒子的宽度**/
                    const lineWith = line.reduce((a, b) => a + b[W], 0);
                    line = line.map(box => {
                        box[L] = box[L] + (this.mainSize[W] - lineWith) / 2;
                        return box;
                    });
                    return line;
                });

                break;
            case JUSTIFY_CONTENT.SPACE_AROUND:
                this.layout = this.layout.map((line) => {
                    /**一行盒子的宽度**/
                    const lineWith = line.reduce((a, b) => a + b[W], 0);
                    line = line.map((box, index) => {
                        box[L] = box[L] + (index * 2 + 1) * (this.mainSize[W] - lineWith) / (line.length * 2);
                        return box;
                    });
                    return line;
                });
                break;
            case JUSTIFY_CONTENT.SPACE_BETWEEN:
                this.layout = this.layout.map((line) => {
                    /**一行盒子的宽度**/
                    const lineWith = line.reduce((a, b) => a + b[W], 0);
                    line = line.map((box, index) => {
                        if (index === 0) {
                            box[L] = 0;
                        } else if (index === line.length - 1) {
                            box[L] += (this.mainSize[W] - lineWith);
                        } else {
                            if (line.length !== 0) {
                                let reduceWidth = line.reduce((al, b) => al + b[W], 0);
                                const gapWidth = (this.mainSize[W] - reduceWidth) / (line.length - 1);
                                box[L] += gapWidth * (index)
                            }
                        }
                        return box;
                    });
                    return line;
                });
                break;
            default:
                break;
        }
        /**根据alignItems设置布局**/
        this.layout = this.layout.map((line) => {
            line = line.map((box) => {
                if (box.alignSelf === ALIGN_ITEMS[FLEX_START]) {
                } else if (box.alignSelf === ALIGN_ITEMS[FLEX_END]) {
                    box[T] += ((box.axisHeight || 0) - box[H])
                } else if (box.alignSelf === ALIGN_ITEMS.CENTER) {
                    box[T] += ((box.axisHeight || 0) - box[H]) / 2
                } else if (box.alignSelf === ALIGN_ITEMS.STRETCH) {
                    //todo
                } else if (box.alignSelf === ALIGN_ITEMS.BASELINE) {
                    //todo
                }
                return box
            });
            return line;
        });
    }

    addChildRect(rect) {
        const {childrenRect} = this.state;
        childrenRect.push(rect);
        this.setState({
            childrenRect
        })
    }

    updateStyle=(style)=> {
        const {W,H} = this;
        const {style: oldStyle} = this.state;
        this.setState({
            style: {
                ...oldStyle,
                [H]: style[H],
                [W]: style[W],
                left: style.left,
                top: style.top
            }
        })
    }

    parent() {
        return this.props.parent;
    }

    renderChildren() {
        let {children, style = {}} = this.props;
        const {
            flexDirection = Flex.defaultStyle.flexDirection,
        } = style;
        let _res = [];
        const isTextNode = typeof children !== 'object';
        if (isTextNode) {
            return <font>{children}</font>;
        }
        if (children) {
            _res = [...React.Children.map(children, item => {
                let itemProps = {};
                if (!isTextNode && item.type.name === 'Flex') {
                    itemProps = {
                        ...item.props,
                        parent: this
                    };
                }
                if (typeof item !== 'object') {
                    item = <font>{item}</font>
                }
                return React.cloneElement(item, itemProps)
            })].sort((a, b) => {
                let _a = 0, _b = 0;
                if (a.props.style) {
                    _a = a.props.style.order
                }
                if (b.props.style) {
                    _b = b.props.style.order
                }
                return _b - _a
            });
            /**如果flexDirection包含reverse**/
            if (flexDirection.includes('reverse')) {
                _res = _res.reverse()
            }
        }

        return _res
    }

    render() {
        const {
            className,
            style = {},
            is,
            inline,
        } = this.props;
        const {
            display = Flex.defaultStyle.display,
            flexDirection = Flex.defaultStyle.flexDirection,
            flexWrap = Flex.defaultStyle.flexWrap,
            flexFlow = Flex.defaultStyle.flexFlow,
            alignItems = Flex.defaultStyle.alignItems,
            alignSelf = Flex.defaultStyle.alignSelf,
            alignContent = Flex.defaultStyle.alignContent,
            justifyContent = Flex.defaultStyle.justifyContent,
            order = Flex.defaultStyle.order,
            flexGrow = Flex.defaultStyle.flexGrow,
            flexShrink = Flex.defaultStyle.flexShrink,
            ...rest
        } = style;
        console.log(this.props)
        return React.createElement(is, {
            className,
            ref: ref => this.ref = ref,
            style: {
                ...rest,
                ...this.state.style,
                display: 'block',
                float: 'unset',
                position: this.parent() ? 'absolute' : 'relative'
            },
            'data-style':objectToStyleText(style),
            children: this.renderChildren()
        });

    }
}
