'use client';

import React, {
  useEffect,
  useCallback,
  useState,
  ChangeEvent,
  useMemo,
} from 'react';
import {
  activateLesson,
  getArchivedLessons,
  deleteLesson,
} from '@src/apiServices/archivedService';
import ArchivedCell from '@src/shared/components/ArchivedCell';
import SearchBox from '@src/shared/components/SearchBox';
import { debounce } from '@src/utils/helpers';
import InfiniteScroll from 'react-infinite-scroll-component';
import ConformationModal from '@src/shared/modals/conformationModal';
import { TLesson } from '@src/shared/types/contentRepository';
import { en } from '@src/constants/lang/en';
import { toast } from 'react-toastify';
import EmptyState from '@src/shared/components/EmptyStatePlaceholder';
import { LoadingSkeleton } from '@src/shared/components/UIElements';

const ArchivedLessons = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [lessonsList, setLessonsList] = useState<TLesson[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [restoreId, setRestoreId] = useState<number | false>(false);
  const [deleteId, setDeleteId] = useState<number | false>(false);

  const fetchLessons = useCallback(
    async (currentPage: number, search: string, resetList = false) => {
      setIsLoading(true);
      try {
        const res = await getArchivedLessons(currentPage, search);
        if (resetList || currentPage === 1) {
          setLessonsList(res.data.items);
        } else {
          setLessonsList((prev) => [...prev, ...res.data.items]);
        }
        setPage(res.data.page + 1);
        setHasMore(res.data.page < res.data.total_pages);
      } catch (error) {
        toast.error(en.common.noResultFound);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    },
    [],
  );

  const getNextLessons = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchLessons(page, searchValue);
    }
  }, [fetchLessons, hasMore, isLoading, page, searchValue]);

  const handleDeleteLesson = useCallback(
    async (id: number) => {
      try {
        await deleteLesson(id);
        setPage(1);
        await fetchLessons(1, searchValue, true);
        setDeleteId(false);
        toast.success(en.archivedSection.lessonDeletedSuccess);
      } catch (error) {
        toast.error(en.common.somethingWentWrong);
      }
    },
    [fetchLessons, searchValue],
  );

  const restoreLesson = useCallback(
    async (id: number) => {
      try {
        await activateLesson({ active: true, id });
        setPage(1);
        await fetchLessons(1, searchValue, true);
        setRestoreId(false);
        toast.success(en.archivedSection.lessonRestoredSuccess);
      } catch (error) {
        toast.error(en.common.somethingWentWrong);
      }
    },
    [fetchLessons, searchValue],
  );

  const handleQueryChange = useMemo(
    () =>
      debounce(async (value: string) => {
        const _value = value || '';
        try {
          setIsLoading(true);
          setSearchValue(_value);
          setPage(1);
          fetchLessons(1, _value, true);
        } catch (err) {
          toast.error(en.common.somethingWentWrong);
        }
      }, 300),
    [fetchLessons],
  );

  useEffect(() => {
    fetchLessons(1, '', true);
  }, [fetchLessons]);

  return (
    <div className="max-w-xl px-4 pb-12 lg:col-span-8">
      <ConformationModal
        title={
          restoreId
            ? en.archivedSection.confirmActivateLesson
            : en.archivedSection.confirmDeleteLesson
        }
        subTitle={
          restoreId
            ? en.archivedSection.confirmActivateLessonSubtext
            : en.archivedSection.confirmDeleteLessonSubtext
        }
        open={Boolean(restoreId || deleteId)}
        //@ts-expect-error will never be true
        setOpen={restoreId ? setRestoreId : setDeleteId}
        onConfirm={() =>
          restoreId
            ? restoreLesson(restoreId)
            : handleDeleteLesson(deleteId as number)
        }
      />
      <h1 className="text-lg leading-6 font-medium text-gray-900">
        {en.archivedSection.archivedLessons}
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        {en.archivedSection.archivedLessonsSubtext}
      </p>
      <SearchBox
        handleChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleQueryChange(e.target.value)
        }
      />
      <div className="flex flex-col w-full min-h-[200px]">
        {isInitialLoad ? (
          <LoadingSkeleton />
        ) : lessonsList.length === 0 ? (
          <EmptyState type="lessons" searchValue={searchValue} />
        ) : (
          <InfiniteScroll
            dataLength={lessonsList.length}
            next={getNextLessons}
            hasMore={hasMore}
            loader={<LoadingSkeleton />}
            scrollThreshold={0.8}
            style={{ overflow: 'visible' }}
          >
            {lessonsList.map((item) => (
              <ArchivedCell
                key={item.id}
                title={item.name}
                subtitle={item.course?.name || ''}
                deactivatedBy={
                  item.updated_by
                    ? `${item.updated_by.first_name} ${item.updated_by.last_name}`
                    : item.archive_by_user
                    ? `${item.archive_by_user.first_name} ${item.archive_by_user.last_name}`
                    : ''
                }
                deactivationDate={item.updated_at}
                onClickDelete={() => setDeleteId(item.id)}
                onClickRestore={() => setRestoreId(item.id)}
                alternateButton
              />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default ArchivedLessons;
