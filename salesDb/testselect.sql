 SELECT pd.*, fp.ProcessStatus from
      FileProcessDetails pd
      INNER JOIN FileProcess fp
        ON fp.FileId = pd.FileId
      where fp.FileId = 3 and
      FileProcessDetailId = (   select max(FileProcessDetailId) from FileProcessDetails WHERE pd.FileId = 3  );

