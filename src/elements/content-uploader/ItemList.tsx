import * as React from 'react';
import noop from 'lodash/noop';
import { Table, Column } from '@box/react-virtualized/dist/es/Table';
import AutoSizer from '@box/react-virtualized/dist/es/AutoSizer';

import nameCellRenderer from './nameCellRenderer';
import progressCellRenderer from './progressCellRenderer';
import actionCellRenderer from './actionCellRenderer';
import removeCellRenderer from './removeCellRenderer';

import type { UploadItem } from '../../common/types/upload';

import '@box/react-virtualized/styles.css';
import './ItemList.scss';

const ACTION_CELL_WIDTH = 32;

export interface ItemListProps {
    isResumableUploadsEnabled?: boolean;
    items: UploadItem[];
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    onRemoveClick?: (item: UploadItem) => void;
    onUpgradeCTAClick?: () => void;
}

export interface cellRendererProps {
    rowData: UploadItem;
}

const ItemList = ({
    isResumableUploadsEnabled = false,
    items,
    onClick,
    onRemoveClick = noop,
    onUpgradeCTAClick,
}: ItemListProps) => (
    <AutoSizer>
        {({ width, height }) => {
            const nameCell = nameCellRenderer(isResumableUploadsEnabled);
            const progressCell = progressCellRenderer(!!onUpgradeCTAClick);
            const actionCell = actionCellRenderer(isResumableUploadsEnabled, onClick, onUpgradeCTAClick);
            const removeCell = removeCellRenderer(onRemoveClick);

            return (
                <Table
                    className="bcu-item-list"
                    disableHeader
                    headerHeight={0}
                    height={height}
                    rowClassName="bcu-item-row"
                    rowCount={items.length}
                    rowGetter={({ index }) => items[index]}
                    rowHeight={50}
                    width={width}
                >
                    <Column cellRenderer={nameCell} dataKey="name" flexGrow={1} flexShrink={1} width={300} />
                    <Column
                        cellRenderer={progressCell}
                        dataKey="progress"
                        flexGrow={1}
                        flexShrink={1}
                        style={{ textAlign: 'right' }}
                        width={300}
                    />
                    <Column
                        className={isResumableUploadsEnabled ? '' : 'bcu-item-list-action-column'}
                        cellRenderer={actionCell}
                        dataKey="status"
                        flexShrink={0}
                        width={onUpgradeCTAClick ? 100 : ACTION_CELL_WIDTH}
                    />
                    {isResumableUploadsEnabled && (
                        <Column
                            className="bcu-item-list-action-column"
                            cellRenderer={removeCell}
                            dataKey="remove"
                            flexShrink={0}
                            width={ACTION_CELL_WIDTH}
                        />
                    )}
                </Table>
            );
        }}
    </AutoSizer>
);

export default ItemList;
