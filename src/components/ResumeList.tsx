import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ResumeCard } from './ResumeCard';
import { ResumeTableRow } from './ResumeTableRow';
import { ResumeListHeader } from './ResumeListHeader';
import { LoadingSpinner } from './shared/LoadingSpinner';
import { EmptyState } from './shared/EmptyState';
import { Description } from '@mui/icons-material';
import type { Resume } from '../types';

interface ResumeListProps {
  resumes: Resume[];
  loading: boolean;
  isDesktop: boolean;
  downloadingId: string | number | null;
  deleting: boolean;
  onDownload: (resume: Resume) => void;
  onDelete: (resume: Resume) => void;
}

export const ResumeList = ({
  resumes,
  loading,
  isDesktop,
  downloadingId,
  deleting,
  onDownload,
  onDelete,
}: ResumeListProps) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (resumes.length === 0) {
    return (
      <EmptyState
        icon={<Description sx={{ fontSize: { xs: 48, sm: 64 }, color: 'text.secondary' }} />}
        title="No resumes uploaded yet"
        description="Upload your first resume to get started"
      />
    );
  }

  return (
    <>
      <ResumeListHeader count={resumes.length} />
      {isDesktop ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  Filename
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  Job Title
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  Uploaded
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    textAlign: 'center',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resumes.map((resume) => (
                <ResumeTableRow
                  key={resume.id}
                  resume={resume}
                  onDownload={onDownload}
                  onDelete={onDelete}
                  downloadingId={downloadingId}
                  deleting={deleting}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: { xs: 1.5, sm: 2, md: 2.5 },
            p: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onDownload={onDownload}
              onDelete={onDelete}
              downloadingId={downloadingId}
              deleting={deleting}
            />
          ))}
        </Box>
      )}
    </>
  );
};

